import LogLevel from './LogLevel';

export default interface RequestClientWrapperConfiguration {
  readonly timeout: number;
  readonly session: string;
  readonly logLevel: LogLevel;
  readonly endpoint: string;
  readonly maximumRequestRetryTimeout: number;
  readonly jitterDelayMsMinimum: number;
  readonly jitterDelayMsMaximum: number;
}
