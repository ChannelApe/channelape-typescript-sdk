import LogLevel from '../model/LogLevel';

export default interface ClientConfiguration {

  sessionId: string;
  timeout?: number;
  endpoint?: string;
  logLevel?: LogLevel;
  maximumRequestRetryTimeout?: number;
  jitterDelayMsMinimum?: number;
  jitterDelayMsMaximum?: number;

}
