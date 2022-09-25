import axios from 'axios';
import * as dayjs from 'dayjs';
import * as qs from 'qs';

import FetchInstruction, {
  FetchInstructionDocument,
  IFetchInstruction,
} from '../../api/tweet-fetch-instructions/model';
import Tweet from '../../api/tweets/model';
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

type ApiTweet = { created_at: string; id: string; text: string };

type TwitterResponse = {
  data?: ApiTweet[];
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

  let nextToken: string | undefined;
  const items: ApiTweet[] = [];

  let response: TwitterResponse;

  try {
    const data = await getTweetList(lastFetchedTweet);

    response = {
      meta: data?.meta,
      data: data?.data ?? [],
    };
    Logger.debug(
      'getRecentTweets',
      'Twitter responded to first page fetch',
      response
    );
  } catch {
    // error already logged
    return;
  }

  response?.data?.forEach((tweet) => items.push(tweet));
  nextToken = response.meta.next_token;

  while (nextToken) {
    try {
      const nextPageData = await getTweetList(lastFetchedTweet, nextToken);
      nextPageData?.data?.forEach((tweet) => items.push(tweet));
      nextToken = nextPageData.meta.next_token;
    } catch {
      // error already logged
      return;
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

export const executeTweetFetch = async () => {
  await FetchInstruction.find({ done: false })
    .cursor()
    .eachAsync(async (instruction) => {
      const { fetchDate, tweetId } = instruction;

      const canFetch = dayjs().isAfter(dayjs(fetchDate).add(1, 'day'));

      if (!canFetch) {
        return;
      }

      let tweetDetail;

      try {
        tweetDetail = await getTweetDetail(tweetId);
      } catch {
        // error already handler
        return;
      }

      Logger.debug(
        'executeTweetFetch',
        `Downloaded tweet detail for ${tweetId}`,
        tweetDetail
      );
      const tweetBody = {
        authorId: tweetDetail?.author_id,
        tweetId: tweetDetail?.id,
        createdAt: tweetDetail?.created_at,
        fetchedAt: Date.now(),
        data: tweetDetail,
      };

      try {
        await Tweet.create(tweetBody);
        await Object.assign(instruction, { done: true }).save();
      } catch (e) {
        Logger.error(
          'executeTweetFetch',
          `Failed to register data for tweet ${tweetId}`,
          { error: e, body: tweetBody }
        );
      }
    });
};

const getTweetList: (
  lastFetchedTweet?: FetchInstructionDocument,
  nextToken?: string
) => Promise<TwitterResponse> = async (lastFetchedTweet, nextToken) => {
  const query: TwitterParams = {
    'tweet.fields': 'created_at',
    query:
      accounts.map((a) => `from:${a}`).join(' OR ') +
      ' -is:reply -is:retweet -is:quote',
  };

  if (lastFetchedTweet) {
    query.since_id = lastFetchedTweet.tweetId;
  } else {
    query.start_time = dayjs().subtract(1, 'day').toISOString();
  }

  if (nextToken) {
    query.next_token = nextToken;
  }

  const requestParams = {
    url: `https://api.twitter.com/2/tweets/search/recent?${qs.stringify(
      query
    )}`,
    headers: {
      authorization: `Bearer ${appEnv.twitterToken}`,
    },
  };

  try {
    const { data } = await axios(requestParams);
    return data;
  } catch (e) {
    Logger.error('getTweetList', 'Failed to download tweet list', {
      request: requestParams,
      error: e,
      response: e?.response?.data,
    });
    throw e;
  }
};

const getTweetDetail = async (tweetId) => {
  const query = {
    'tweet.fields':
      'text,author_id,created_at,public_metrics,referenced_tweets,source,in_reply_to_user_id,entities,context_annotations,conversation_id',
    'media.fields': 'type,url,public_metrics,alt_text',
  };
  const requestParams = {
    url: `https://api.twitter.com/2/tweets/${tweetId}?${qs.stringify(query)}`,
    headers: {
      Authorization: `Bearer ${appEnv.twitterToken}`,
    },
  };

  try {
    const { data } = await axios(requestParams);
    return data?.data;
  } catch (e) {
    Logger.error('getTweetDetail', 'Failed to get tweet detail', {
      error: e,
      request: requestParams,
      response: e?.response?.data,
    });
    throw e;
  }
};
