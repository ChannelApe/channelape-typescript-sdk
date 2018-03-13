import SessionRequest from './../model/SessionRequest';
import * as Q from 'q';
import response from '../../model/response';
import * as log4js from 'log4js';
import SessionResponse from './../model/SessionResponse';
import { Client } from 'node-rest-client';
import { Endpoints } from '../../model/Endpoints';
import { Versions } from '../../model/Versions';

const STARTING_TO_RETRIEVE_MESSAGE = 'Retrieving session';
const LOGGER_ID = 'SessionRetrievalService';

export default class SessionRetrievalService {

  private logger = log4js.getLogger(LOGGER_ID);
  
  constructor(private client: any, private endpoint:string) {}

  public retrieveSession(sessionRequest: SessionRequest): Q.Promise<SessionResponse> {
    
    this.logger.info(STARTING_TO_RETRIEVE_MESSAGE);
    const deferred = Q.defer<SessionResponse>();
    const requestUrl = `${this.endpoint}/${Versions.V1}${Endpoints.SESSIONS}`;
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
