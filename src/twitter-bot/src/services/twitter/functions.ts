import axios from 'axios';
import * as dayjs from 'dayjs';
import * as qs from 'qs';

import FetchInstruction, {
  IFetchInstruction,
} from '../../api/tweet-fetch-instructions/model';
import appEnv from '../../constants/env';
import Logger from '../logs';
import { accounts } from './constants';

interface TwitterParams {
  since_id?: string;
  start_time?: string;
  query?: string;
  'tweet.fields'?: string;
  next_token?: string;
}

type Tweet = { created_at: string; id: string; text: string };

type TwitterResponse = {
  data?: Tweet[];
  meta: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
  };
};

export const getRecentTweets = async () => {
  Logger.debug('getRecentTweets', 'Execution start');

  const lastFetchedTweet = (
    await FetchInstruction.find({})
      .sort({
        fetchDate: 'desc',
      })
      .limit(1)
  )?.[0];

  Logger.debug(
    'getRecentTweets',
    `Last tweet we fetched: ${
      lastFetchedTweet ? lastFetchedTweet.tweetId : 'none'
    }`,
    lastFetchedTweet
  );

  const queryParams: TwitterParams = {
    'tweet.fields': 'created_at',
    query:
      accounts.map((a) => `from:${a}`).join(' OR ') +
      ' -is:reply -is:retweet -is:quote',
  };

  if (lastFetchedTweet) {
    queryParams.since_id = lastFetchedTweet.tweetId;
  } else {
    queryParams.start_time = dayjs().subtract(5, 'day').toISOString();
  }

  let nextToken: string | undefined;
  const items: Tweet[] = [];

  let response: TwitterResponse;

  const requestParams = {
    url: `https://api.twitter.com/2/tweets/search/recent?${qs.stringify(
      queryParams
    )}`,
    headers: {
      authorization: `Bearer ${appEnv.twitterToken}`,
    },
  };

  try {
    const { data }: { data: TwitterResponse } = await axios(requestParams);

    response = {
      meta: data?.meta,
      data: data?.data ?? [],
    };
    Logger.debug(
      'getRecentTweets',
      'Twitter responded to first page fetch',
      response
    );
  } catch (e) {
    Logger.error('getRecentTweets', `First page fetch failed: ${e.message}`, {
      response: e?.response?.data,
      request: requestParams,
    });
    return;
  }

  response?.data?.forEach((tweet) => items.push(tweet));
  nextToken = response.meta.next_token;

  while (nextToken) {
    const nextPageRequestParams = {
      url: 'https://api.twitter.com/2/tweets/search/recent',
      params: qs.stringify({ ...queryParams, next_token: nextToken }),
      headers: {
        authorization: `Bearer ${appEnv.twitterToken}`,
      },
    };
    try {
      queryParams.next_token = nextToken;
      const { data: nextPageData }: { data: TwitterResponse } = await axios(
        nextPageRequestParams
      );
      nextPageData?.data?.forEach((tweet) => items.push(tweet));
      nextToken = nextPageData.meta.next_token;
    } catch (e) {
      Logger.error(
        'getRecentTweets',
        `Subsequent page fetch failed: ${e.message}`,
        { response: e?.response?.data, request: nextPageRequestParams }
      );
    }
  }

  Logger.debug('getRecentTweets', `Done fetching ${items.length} new tweets`);

  for (const tweet of items) {
    const instructionBody: IFetchInstruction = {
      tweetId: tweet.id,
      fetchDate: dayjs(tweet.created_at).add(1, 'day').toDate(),
    };
    await FetchInstruction.create(instructionBody).catch((e) => {
      Logger.error(
        'getRecentTweets',
        'Failed to write fetch instruction for tweet',
        e
      );
    });
  }

  Logger.info('getRecentTweets', `Finished execution`);
};
