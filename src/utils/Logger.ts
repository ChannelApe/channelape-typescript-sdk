import * as winston from 'winston';
import * as util from 'util';
import LogLevel from '../model/LogLevel';

const LOG_FORMAT = '[%s] - %s';

export default class Logger {
  private logger = this.createLogger();

  constructor(private loggerName: string, private logLevel: LogLevel) { }

  public error(log: string): void {
    this.logger.error(util.format(LOG_FORMAT, this.loggerName, log));
  }

  public warn(log: string): void {
    this.logger.warn(util.format(LOG_FORMAT, this.loggerName, log));
  }

  public info(log: string): void {
    this.logger.info(util.format(LOG_FORMAT, this.loggerName, log));
  }

  public debug(log: string): void {
    this.logger.debug(util.format(LOG_FORMAT, this.loggerName, log));
  }

  private createLogger() {
    return new winston.Logger({
      transports: [new winston.transports.Console({ formatter: this.logFormatter })],
      level: this.logLevel
    });
  }

  private logFormatter(options: any): string {
    const now = new Date();
    const level = options.level.toUpperCase();
    return `[${now.toISOString()}] [${level}] ${options.message}`;
  }
}
