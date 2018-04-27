export enum LogLevel {
  OFF = -1,
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  VERBOSE = 3,
  DEBUG = 4
}

export function getLogLevelName(level: LogLevel): string {
  let levelName: string = '';
  switch (level) {
    case (LogLevel.OFF):
      levelName = 'OFF';
      break;
    case (LogLevel.ERROR):
      levelName = 'ERROR';
      break;
    case (LogLevel.WARN):
      levelName = 'WARN';
      break;
    case (LogLevel.INFO):
      levelName = 'INFO';
      break;
    case (LogLevel.VERBOSE):
      levelName = 'VERBOSE';
      break;
    case (LogLevel.DEBUG):
      levelName = 'DEBUG';
      break;
    default:
      levelName = 'OFF';
      break;
  }
  return levelName;
}

export default LogLevel;
