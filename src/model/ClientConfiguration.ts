import LogLevel from './LogLevel';

export default interface ClientConfiguration {

  sessionId: string;
  timeout?: number;
  endpoint?: string;
  logLevel?: LogLevel;

}
