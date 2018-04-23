import CredentialSessionRequest from './../model/CredentialSessionRequest';
import * as Q from 'q';
import * as log4js from 'log4js';
import SessionResponse from './../model/SessionResponse';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import Endpoint from '../../model/Endpoint';
import Version from '../../model/Version';
import SessionIdSessionRequest from './../model/SessionIdSessionRequest';
import request = require('request');

const STARTING_TO_RETRIEVE_MESSAGE = 'Retrieving session';
const LOGGER_ID = 'SessionRetrievalService';
const FATAL_ERROR_MESSAGE = 'FATAL ERROR making restful request to retrieve: ';

export default class SessionRetrievalService {

  private logger: log4js.Logger = log4js.getLogger(LOGGER_ID);

  constructor(private client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>,
    private endpoint: string) { }

  retrieveSession(
    sessionRequest: SessionIdSessionRequest | CredentialSessionRequest) {
    if ((sessionRequest as SessionIdSessionRequest).sessionId != null) {
      return this.retrieveSessionBySessionId((sessionRequest as SessionIdSessionRequest));
    }

    return this.retrieveSessionByCredentials(sessionRequest as CredentialSessionRequest);
  }

  private retrieveSessionByCredentials(
    sessionRequest: CredentialSessionRequest): Q.Promise<SessionResponse> {

    this.logger.info(STARTING_TO_RETRIEVE_MESSAGE);
    const deferred = Q.defer<SessionResponse>();
    const requestUrl = `${this.endpoint}/${Version.V1}${Endpoint.SESSIONS}`;
    this.logger.debug(`HTTP Request: POST ${requestUrl}`);

    const options: request.CoreOptions = {
      auth: {
        username: sessionRequest.email,
        password: sessionRequest.password
      },
      json: true
    };
    this.client.post(requestUrl, options, (error, response, body) => {
      if (error) {
        this.logger.error(`${FATAL_ERROR_MESSAGE}${error}`);
        deferred.reject(error);
      } else if (response.statusCode === 201) {
        deferred.resolve(body as SessionResponse);
      } else {
        const channelApeErrorResponse = body as ChannelApeErrorResponse;
        channelApeErrorResponse.statusCode = response.statusCode;
        deferred.reject(channelApeErrorResponse);
      }
    });

    return deferred.promise;
  }
  private retrieveSessionBySessionId(
    sessionRequest: SessionIdSessionRequest): Q.Promise<SessionResponse> {

    this.logger.info(STARTING_TO_RETRIEVE_MESSAGE);
    const deferred = Q.defer<SessionResponse>();
    const requestUrl = `${this.endpoint}/${Version.V1}${Endpoint.SESSIONS}/${sessionRequest.sessionId}`;
    this.logger.debug(`HTTP Request: GET ${requestUrl}`);

    const options: request.CoreOptions = {
      json: true
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      if (error) {
        this.logger.error(`${FATAL_ERROR_MESSAGE}${error}`);
        deferred.reject(error);
      } else if (response.statusCode === 200) {
        deferred.resolve(body as SessionResponse);
      } else {
        const channelApeErrorResponse = body as ChannelApeErrorResponse;
        channelApeErrorResponse.statusCode = response.statusCode;
        deferred.reject(channelApeErrorResponse);
      }
    });

    return deferred.promise;
  }

}
