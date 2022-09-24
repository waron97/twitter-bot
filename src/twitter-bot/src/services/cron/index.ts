import * as cron from 'node-cron';

export default function scheduleTask(frequency: string, callback: () => void) {
  cron.schedule(frequency, callback);
}
