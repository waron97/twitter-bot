import appEnv from './env';

const { mongoContainerName, mongoDbName } = appEnv;

export const mongoUri = `mongodb://${mongoContainerName}/${mongoDbName}`;
