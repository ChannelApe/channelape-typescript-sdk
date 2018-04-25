import request = require('request');
import * as Q from 'q';
import ClientConfiguration from './../src/model/ClientConfiguration';
import SessionRetrievalService from './sessions/service/SessionRetrievalService';
import ActionRetrievalService from './actions/service/ActionRetrievalService';
import CredentialSessionRequest from './sessions/model/CredentialSessionRequest';
import Session from './sessions/model/Session';
import SessionIdSessionRequest from './sessions/model/SessionIdSessionRequest';
import Action from './actions/model/Action';

const INVALID_CONFIGURATION_ERROR_MESSAGE = 'Invalid configuration. username and password or session ID is required.';
export default class ChannelapeClient {

  private readonly client : request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;
  private readonly sessionRetrievalService: SessionRetrievalService;
  private readonly actionRetrievalService: ActionRetrievalService;

  constructor(private readonly config: ClientConfiguration) { 
    this.client = request.defaults({
      baseUrl: config.Endpoint,
      timeout: 60000,
      json: true
    });
    this.sessionRetrievalService = new SessionRetrievalService(this.client);
    this.actionRetrievalService = new ActionRetrievalService(this.client);
  }

  getSession() {
    if (this.config.hasCredentials()) {
      const sessionRequest: CredentialSessionRequest = {
        username: this.config.Username,
        password: this.config.Password
      };
      return this.sessionRetrievalService.retrieveSession(sessionRequest);
    }

    if (this.config.hasSession()) {
      const sessionRequest: SessionIdSessionRequest = {
        sessionId: this.config.SessionId
      };
      return this.sessionRetrievalService.retrieveSession(sessionRequest);
    } 
      
    const deferred = Q.defer<Session>();
    deferred.reject(INVALID_CONFIGURATION_ERROR_MESSAGE);
    return deferred.promise;
  }

  getAction(actionId: string) {
    return this.getSession().then(session => this.actionRetrievalService.retrieveAction(session.sessionId, actionId));
  }

}
