import LogLevel from './LogLevel';

export default interface RequestClientWrapperConfiguration {
  readonly timeout: number;
  readonly session: string;
  readonly logLevel: LogLevel;
  readonly endpoint: string;
  readonly maximumRequestRetryTimeout: number;
  readonly minimumRequestRetryRandomDelay: number;
  readonly maximumRequestRetryRandomDelay: number;
}
