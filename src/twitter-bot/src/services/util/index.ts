const seconds = (n: number) => n * 1000;
const minutes = (n: number) => seconds(n) * 60;

export const sleep = (duration: number, unit: 'seconds' | 'minutes') => {
  const t = unit === 'seconds' ? seconds(duration) : minutes(duration);
  return new Promise((resolve) => setTimeout(resolve, t));
};
