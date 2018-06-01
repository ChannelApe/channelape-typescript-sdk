import { LogLevel } from 'channelape-logger';

export default interface ClientConfiguration {

  sessionId: string;
  timeout?: number;
  endpoint?: string;
  logLevel?: LogLevel;

}
