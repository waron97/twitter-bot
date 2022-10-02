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
import { sleep } from '../util';
import { accounts } from './constants';

interface TwitterParams {
  since_id?: string;
  start_time?: string;
  query?: string;
  'tweet.fields'?: string;
  next_token?: string;
  max_results?: number;
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
  const splits = getAccountQuerySplits();
  const lastFetchedTweet = (
    await FetchInstruction.find({})
      .sort({
        fetchDate: 'desc',
      })
      .limit(1)
  )?.[0];
  Logger.info(
    'getRecentTweets',
    `Starting tweet fetch in ${splits.length} splits`,
    { splits }
  );
  Logger.debug(
    'getRecentTweets',
    `Last tweet we fetched: ${
      lastFetchedTweet ? lastFetchedTweet.tweetId : 'none'
    }`,
    lastFetchedTweet
  );
  for (const split of splits) {
    await getAccountSplitTweets(split, lastFetchedTweet);
    // have to sleep in between batches to not exceed rate limits
    Logger.debug(
      'getRecentTweets',
      'Starting 15 minute wait before next batch'
    );
    await sleep(15, 'minutes');
  }
  Logger.info(`getRecentTweets`, 'Execution finished for function');
};

const getAccountSplitTweets = async (
  accounts: string,
  lastFetchedTweet: FetchInstructionDocument
) => {
  Logger.debug('getAccountSplitTweets', 'Execution start for account split', {
    accounts,
  });

  let nextToken: string | undefined;
  const items: ApiTweet[] = [];

  let response: TwitterResponse;

  try {
    const data = await getTweetList(accounts, lastFetchedTweet);

    response = {
      meta: data?.meta,
      data: data?.data ?? [],
    };
  } catch {
    // error already logged
    return;
  }

  response?.data?.forEach((tweet) => items.push(tweet));
  nextToken = response.meta.next_token;

  while (nextToken) {
    try {
      const nextPageData = await getTweetList(
        accounts,
        lastFetchedTweet,
        nextToken
      );
      nextPageData?.data?.forEach((tweet) => items.push(tweet));
      nextToken = nextPageData?.meta?.next_token;
    } catch {
      // error already logged
      return;
    }
  }

  Logger.debug(
    'getAccountSplitTweets',
    `Done fetching ${items.length} new tweets`
  );

  for (const tweet of items) {
    const instructionBody: IFetchInstruction = {
      tweetId: tweet.id,
      fetchDate: dayjs(tweet.created_at).add(1, 'day').toDate(),
    };
    await FetchInstruction.create(instructionBody).catch((e) => {
      Logger.error(
        'getAccountSplitTweets',
        'Failed to write fetch instruction for tweet',
        e
      );
    });
  }

  Logger.debug('getAccountSplitTweets', `Finished execution for current batch`);
};

export const executeTweetFetch = async () => {
  const now = dayjs();
  await FetchInstruction.find({
    done: false,
    fetchDate: { $gte: now.subtract(10, 'minutes').toDate() },
  })
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
    })
    .catch((e) => {
      Logger.error('executeTweetFetch', 'Generic catch occurred', e);
    });
};

const getTweetList: (
  accounts: string,
  lastFetchedTweet?: FetchInstructionDocument,
  nextToken?: string
) => Promise<TwitterResponse> = async (
  accounts,
  lastFetchedTweet,
  nextToken
) => {
  const query: TwitterParams = {
    'tweet.fields': 'created_at',
    query: `(${accounts})  -is:reply -is:retweet -is:quote`,
    max_results: 100,
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
    Logger.debug('getTweetList', 'Tweet list download successful', {
      request: requestParams,
      response: data,
    });
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

const getAccountQuerySplits = () => {
  // query length cannot be longer than 500, so we need to make more smaller fetches
  const splits: string[] = [];
  let currentSplit: string[] = [];

  for (const account of accounts) {
    const splitLength = currentSplit.reduce(
      (acc, current) => acc + current.length,
      0
    );
    if (splitLength < 300) {
      currentSplit.push(`from:${account}`);
    } else {
      splits.push(currentSplit.join(' OR '));
      currentSplit = [account];
    }
  }
  return splits;
};

const getTweetDetail = async (tweetId: string) => {
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

    Logger.debug('getTweetDetail', `Downloaded tweet data for ${tweetId}`, {
      request: requestParams,
      respinse: data,
    });

    if (!data?.data?.id) {
      Logger.warning(
        'getTweetDetail',
        'Edge case: downlaoded tweet has no id',
        { request: requestParams, response: data }
      );
    }

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
