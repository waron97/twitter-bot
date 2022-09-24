const requireProcessEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Process env not found: "${key}"`);
  }
  return value;
};

const appEnv = {
  mongoRootUser: requireProcessEnv('MONGO_ROOT_USER'),
  mongoRootPassword: requireProcessEnv('MONGO_ROOT_PASSWORD'),
  mongoDbName: requireProcessEnv('MONGO_DB_NAME'),
};

export default appEnv;
