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
  mongoDbName: requireProcessEnv('MONGO_DB_NAME'),
  port: requireProcessEnv('APP_PORT'),
};

export default appEnv;
