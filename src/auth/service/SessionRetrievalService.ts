import SessionRequest from './../model/SessionRequest';
import * as Q from 'q';
import response from '../../model/response';
import * as log4js from 'log4js';
import SessionResponse from './../model/SessionResponse';

import { Client } from 'node-rest-client';

export default class SessionRetrievalService {

  private logger = log4js.getLogger('SessionRetrievalService');
  
  constructor(private client: any, private endpoint:string) {}

  public retrieveSession(sessionRequest: SessionRequest): Q.Promise<SessionResponse> {
    
    this.logger.info('Retrieving session');
    const deferred = Q.defer<SessionResponse>();
    const requestUrl = `${this.endpoint}/v1/sessions`;
    this.logger.debug('Started');
    this.logger.debug(`HTTP Request: POST ${requestUrl}`);
    const req = this.client.post(requestUrl, [], (response: SessionResponse, data: any) => {
      deferred.resolve(response);
    });
    req.on('error', (err: any) => {
      this.logger.error(`FATAL ERROR making restful request to retrieve: ${err}`);
      deferred.reject(err);
    });
    return deferred.promise;
  }

}
