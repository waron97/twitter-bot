import axios from 'axios';

import appEnv from '../../constants/env';

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

interface LogParams {
  location: string;
  message?: string;
  detail?: any;
}

type Level = {
  level: LogLevel;
};

const dispatchLog = async (params: LogParams & Level) => {
  await axios.post(appEnv.logsServiceUrl, params).catch((e) => {
    // eslint-disable-next-line
    console.log(
      '[ERROR] Failed to dispatch log to url',
      appEnv.logsServiceUrl,
      'reason',
      e.message
    );
  });
};

const Logger = {
  log: (params: LogParams & Level) => {
    return dispatchLog(params);
  },
  debug: (location: string, message?: string, detail?: any) => {
    return dispatchLog({
      level: LogLevel.DEBUG,
      location,
      message,
      detail,
    });
  },
  info: (location: string, message?: string, detail?: any) => {
    return dispatchLog({
      level: LogLevel.INFO,
      location,
      message,
      detail,
    });
  },
  warning: (location: string, message?: string, detail?: any) => {
    return dispatchLog({
      level: LogLevel.WARNING,
      location,
      message,
      detail,
    });
  },
  error: (location: string, message?: string, detail?: any) => {
    return dispatchLog({
      level: LogLevel.ERROR,
      location,
      message,
      detail,
    });
  },
  critical: (location: string, message?: string, detail?: any) => {
    return dispatchLog({
      level: LogLevel.CRITICAL,
      location,
      message,
      detail,
    });
  },
};

export default Logger;
