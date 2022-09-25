import scheduleTask from '../cron';
import { executeTweetFetch, getRecentTweets } from './functions';

export default function initTwitterCron() {
  scheduleTask('0 */4 * * *', getRecentTweets);
  scheduleTask('* * * * *', executeTweetFetch);
}
