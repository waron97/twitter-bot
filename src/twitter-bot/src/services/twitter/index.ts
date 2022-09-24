import scheduleTask from '../cron';
import { getRecentTweets } from './functions';

export default function initTwitterCron() {
  scheduleTask('* * * * *', getRecentTweets);
}
