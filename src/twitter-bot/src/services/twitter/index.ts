import scheduleTask from '../cron';
import { executeTweetFetch, getRecentTweets } from './functions';

export default function initTwitterCron() {
  scheduleTask('* * * * *', getRecentTweets);
  scheduleTask('* * * * *', executeTweetFetch);
}
