export enum LogLevel {
  OFF = -1,
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  VERBOSE = 3,
  DEBUG = 4
}

export function getLogLevelName(level: LogLevel): string {
  if (!LogLevel.hasOwnProperty(level)) {
    return 'OFF';
  }
  return LogLevel[level];
}

export default LogLevel;
