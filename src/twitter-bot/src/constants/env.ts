const requireProcessEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Process env not found: "${key}"`);
  }
  return value;
};

const appEnv = {
  mongoRootUser: requireProcessEnv('MONGO_ROOT_USERNAME'),
  mongoRootPassword: requireProcessEnv('MONGO_ROOT_PASSWORD'),
  mongoContainerName: requireProcessEnv('MONGO_CONTAINER_NAME'),
  mongoDbName: requireProcessEnv('MONGO_DB_NAME'),
  port: requireProcessEnv('APP_PORT'),
  logsApiKey: requireProcessEnv('LOGS_API_KEY'),
  logsAppId: requireProcessEnv('LOGS_APP_ID'),
  logsServiceUrl: requireProcessEnv('LOGS_URI'),
};

export default appEnv;
