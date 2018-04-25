import request = require('request');
import * as Q from 'q';
import ClientConfiguration from './../src/model/ClientConfiguration';
import SessionRetrievalService from './sessions/service/SessionRetrievalService';
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

  constructor(private readonly config: ClientConfiguration) {  }

  getSession() {
    const deferred = Q.defer<Session>();

    if (this.config.hasCredentials()) {
      const sessionRequest: CredentialSessionRequest = {
        username: this.config.Username,
        password: this.config.Password
      };
      const sessionRetrievalService = new SessionRetrievalService(ChannelapeClient.CLIENT, this.config.Endpoint);
      sessionRetrievalService.retrieveSession(sessionRequest)
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
      const sessionRetrievalService = new SessionRetrievalService(ChannelapeClient.CLIENT, this.config.Endpoint);
      sessionRetrievalService.retrieveSession(sessionRequest)
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
    const deferred = Q.defer<Action>();

    const action: Action = {
      action: 'PRODUCT_PULL',
      businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
      description: 'Encountered error during product pull for Europa Sports',
      healthCheckIntervalInSeconds: 300,
      id: 'a85d7463-a2f2-46ae-95a1-549e70ecb2ca',
      lastHealthCheckTime: '2018-04-24T14:02:34.703Z',
      processingStatus: 'error',
      startTime: '2018-04-24T14:02:34.703Z',
      targetId: '1e4ebaa6-9796-4ccf-bd73-8765893a66bd',
      targetType: 'supplier'
    };
    deferred.resolve(action);

    return deferred.promise;
  }

}
