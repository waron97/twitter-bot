import { Document, Schema, model } from 'mongoose';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

type AnyObject = { [key: string]: any };

export interface ILog {
  appId: string;
  level: LogLevel;
  location: string;
  message: string;
  detail: AnyObject;
}

export type LogDocument = ILog & Document;

const logSchema = new Schema<ILog>({
  appId: {
    type: String,
    required: true,
    index: true,
  },
  level: {
    type: String,
    required: true,
    default: LogLevel.DEBUG,
    enum: ['debug', 'info', 'warning', 'error', 'critical'],
  },
  location: {
    type: String,
  },
  message: {
    type: String,
  },
  detail: {
    type: {},
  },
});

const Log = model<ILog>('Log', logSchema);

export default Log;
