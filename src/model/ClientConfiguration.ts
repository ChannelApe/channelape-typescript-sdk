import LogLevel from '../model/LogLevel';

export default interface ClientConfiguration {

  sessionId: string;
  refreshToken?: string;
  timeout?: number;
  endpoint?: string;
  logLevel?: LogLevel;
  maximumRequestRetryTimeout?: number;
  minimumRequestRetryRandomDelay?: number;
  maximumRequestRetryRandomDelay?: number;
  maximumConcurrentConnections?: number;

}
