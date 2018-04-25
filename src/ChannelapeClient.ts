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

  private static readonly CLIENT = request.defaults({
    timeout: 60000,
    json: true
  });

  private readonly sessionRetrievalService: SessionRetrievalService;
  private readonly actionRetrievalService: ActionRetrievalService;

  constructor(private readonly config: ClientConfiguration) { 
    this.sessionRetrievalService = new SessionRetrievalService(ChannelapeClient.CLIENT, this.config.Endpoint);
    this.actionRetrievalService = new ActionRetrievalService(ChannelapeClient.CLIENT, this.config.Endpoint);
  }

  getSession() {
    const deferred = Q.defer<Session>();

    if (this.config.hasCredentials()) {
      const sessionRequest: CredentialSessionRequest = {
        username: this.config.Username,
        password: this.config.Password
      };

      this.sessionRetrievalService.retrieveSession(sessionRequest)
        .then((response: Session) => {
          deferred.resolve(response);
        })
        .catch((e) => {
          deferred.reject(e);
        });
    } else if (this.config.hasSession()) {
      const sessionRequest: SessionIdSessionRequest = {
        sessionId: this.config.SessionId
      };
      this.sessionRetrievalService.retrieveSession(sessionRequest)
        .then((response: Session) => {
          deferred.resolve(response);
        })
        .catch((e) => {
          deferred.reject(e);
        });
    } else {
      deferred.reject(INVALID_CONFIGURATION_ERROR_MESSAGE);
    }

    return deferred.promise;
  }

  getAction(actionId: string) {
    return this.getSession().then(session => this.actionRetrievalService.retrieveAction(session.sessionId, actionId));
  }

}
