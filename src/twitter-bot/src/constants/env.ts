const requireProcessEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Process env not found: "${key}"`);
  }
  return value;
};

const appEnv = {
  mongoUri: requireProcessEnv('MONGO_URI'),
  port: requireProcessEnv('APP_PORT'),
  logsApiKey: requireProcessEnv('LOGS_API_KEY'),
  logsAppId: requireProcessEnv('LOGS_APP_ID'),
  logsServiceUrl: requireProcessEnv('LOGS_URI'),
  twitterToken: requireProcessEnv('TWITTER_BEARER_TOKEN'),
};

export default appEnv;
