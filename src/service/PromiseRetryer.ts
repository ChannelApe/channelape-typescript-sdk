import * as Q from 'q';
import * as log4js from 'log4js';
import Response from './../model/Response';

export default class PromiseRetryer {
  private logger: log4js.Logger;
  private minDelay = 1000;
  private maxAttempts = 30;
  private base = 1000;
  private retryFunction: Function = () => {};
  private finalResponseCodes: number[] = [];

  constructor(private logName: string) {
    this.logger = log4js.getLogger(logName);
    return this;
  }

  public setMinDelay(value: number) {
    this.minDelay = value;
    return this;
  }

  public setMaxAttempts(value: number) {
    this.maxAttempts = value;
    return this;
  }

  public setBase(value: number) {
    this.base = value;
    return this;
  }

  public setRetryFunction(value: Function) {
    this.retryFunction = value;
    return this;
  }

  public setFinalResponseCodes(value: number[]) {
    this.finalResponseCodes = value;
    return this;
  }

  public run(attempt: number = 1): Q.Promise<{}> {
    const deferred = Q.defer();
    const promise = this.retryFunction();
    promise
      .then((response: Response) => this.responseHandler(response, attempt, deferred))
      .catch((err: any) => this.errorResponseHandler(attempt, deferred, err));
    return deferred.promise;
  }

  private responseHandler(response: Response, attempt: number, deferred: any) {
    const status = response.getStatus();
    const shouldRetry =
    (this.finalResponseCodes.indexOf(status) === -1 && attempt <= this.maxAttempts);
    if (shouldRetry) {
      this.logger.warn(`response status of ${status} | Retrying attempt #${attempt}`);
      const delay = this.minDelay + (Math.random() * (attempt * this.base));
      this.logger.warn(`Waiting ${delay}ms before next attempt.`);
      setTimeout(() => {
        const nextAttempt = attempt + 1;
        deferred.resolve(this.run(nextAttempt));
      }, delay);
    } else {
      deferred.resolve(response);
    }
  }

  private errorResponseHandler(attempt: number, deferred: any, err: any) {
    const shouldRetry = (attempt <= this.maxAttempts);
    if (shouldRetry) {
      this.logger.warn(`There was an error in connection | Retrying attempt #${attempt}`);
      const delay = this.minDelay + (Math.random() * (attempt * this.base));
      this.logger.warn(`Waiting ${delay}ms before next attempt.`);
      setTimeout(() => {
        const nextAttempt = attempt + 1;
        deferred.resolve(this.run(nextAttempt));
      }, delay);
    } else {
      deferred.reject(new Error(err));
    }
  }
}
