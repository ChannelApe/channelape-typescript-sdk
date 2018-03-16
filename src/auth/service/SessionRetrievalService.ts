import CredentialSessionRequest from './../model/CredentialSessionRequest';
import * as Q from 'q';
import response from '../../model/response';
import * as log4js from 'log4js';
import SessionResponse from './../model/SessionResponse';
import { Client } from 'node-rest-client';
import { Endpoints } from '../../model/Endpoints';
import { Versions } from '../../model/Versions';
import SessionIdSessionRequest from './../model/SessionIdSessionRequest';

const STARTING_TO_RETRIEVE_MESSAGE = 'Retrieving session';
const LOGGER_ID = 'SessionRetrievalService';
const FATAL_ERROR_MESSAGE = 'FATAL ERROR making restful request to retrieve: ';

export default class SessionRetrievalService {

  private logger = log4js.getLogger(LOGGER_ID);
  
  constructor(private client: any, private endpoint:string) {}

  public retrieveSession(sessionRequest: SessionIdSessionRequest | CredentialSessionRequest): Promise<SessionResponse> {
    if ((<SessionIdSessionRequest>sessionRequest).sessionId) {
      return this.retrieveSessionBySessionId((<SessionIdSessionRequest>sessionRequest));
    }

    return this.retrieveSessionByCredentials(<CredentialSessionRequest>sessionRequest);
  }
    
  private retrieveSessionByCredentials(
    sessionRequest: CredentialSessionRequest): Promise<SessionResponse> {
    
    this.logger.info(STARTING_TO_RETRIEVE_MESSAGE);
    const requestUrl = `${this.endpoint}/${Versions.V1}${Endpoints.SESSIONS}`;
    this.logger.debug(`HTTP Request: POST ${requestUrl}`);

    return new Promise((resolve, reject) => {
      const req = this.client.post(requestUrl, [], (response: SessionResponse, data: any) => {
        resolve(response);
      });
  
      req.on('error', (err: any) => {
        this.logger.error(`${FATAL_ERROR_MESSAGE}${err}`);
        reject(err);
      });
    });
    
  }

  private retrieveSessionBySessionId(
    sessionRequest: SessionIdSessionRequest): Promise<SessionResponse> {

    this.logger.info(STARTING_TO_RETRIEVE_MESSAGE);
    const requestUrl = `${this.endpoint}/${Versions.V1}${Endpoints.SESSIONS}/${sessionRequest.sessionId}`;
    this.logger.debug(`HTTP Request: GET ${requestUrl}`);

    return new Promise((resolve, reject) => {
      const req = this.client.get(requestUrl, [], (response: SessionResponse, data: any) => {
        resolve(response);
      });
  
      req.on('error', (err: any) => {
        this.logger.error(`${FATAL_ERROR_MESSAGE}${err}`);
        reject(err);
      });
    });
  }
}
