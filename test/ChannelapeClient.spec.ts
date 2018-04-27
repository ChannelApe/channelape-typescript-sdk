import ChannelapeClient from './../src/ChannelapeClient';
import { expect } from 'chai';
import SessionsService from './../src/sessions/service/SessionsService';
import ActionsService from './../src/actions/service/ActionsService';
import * as sinon from 'sinon';
import Session from './../src/sessions/model/Session';

import ClientConfiguration from './../src/model/ClientConfiguration';
import ChannelApeErrorResponse from './../src/model/ChannelApeErrorResponse';
import ClientConfigurationBuilder from './../src/model/ClientConfigurationBuilder';
import Action from './../src/actions/model/Action';

const someEndpoint : string = 'https://some-api.channelape.com';
describe('Channelape Client', () => {

  
  let sandbox : sinon.SinonSandbox;
  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe('given some channelape client configuration, created with user credentials', () => {
    const channelapeClient : ChannelapeClient  = generateCredentialSessionClient();

    it('when getting session for a valid user, then return resolved promise with session data', () => {
      const expectedSession: Session = {
        userId: 'someuserId',
        sessionId: 'some password'
      };
      const retrieveSessionStub : sinon.SinonStub = sandbox.stub(SessionsService.prototype, 'create')
      .callsFake((username: string, password: string) => {
        return Promise.resolve(expectedSession);
      });
      return channelapeClient.getSession().then((session) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(session).to.equal(expectedSession);
      });
    });

    it('when getting session for a invalid session, then return reject promise with error', () => {
      const expectedErrorMessage : string = 'There was an error';

      const retrieveSessionStub : sinon.SinonStub = sandbox.stub(SessionsService.prototype, 'create')
      .callsFake((username: string, password: string) => {
        return Promise.reject('There was an error');
      });

      return channelapeClient.getSession().catch((error) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(error).to.equal(expectedErrorMessage);
      });
    });

    
  });

  describe('given some channelape client configuration, created with session ID', () => {
    const channelapeClient : ChannelapeClient = generateSessionIdClient();

    it('when getting session for a valid user, then return resolved promise with session data', () => {
      const expectedSession: Session = {
        userId: 'someuserId',
        sessionId: 'somesessionid'
      };
      const retrieveSessionStub = sandbox.stub(SessionsService.prototype, 'get')
      .callsFake((sessionId: string) => {
        return Promise.resolve(expectedSession);
      });
      return channelapeClient.getSession().then((session) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(session).to.equal(expectedSession);
      });
    });

    it('when getting session for a invalid session, then return reject promise with error', () => {
      const expectedErrorMessage : string = 'There was an error';

      const retrieveSessionStub : sinon.SinonStub = sandbox.stub(SessionsService.prototype, 'get')
      .callsFake((sessionId: string) => {
        return Promise.reject('There was an error');
      });

      return channelapeClient.getSession().catch((error) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(error).to.equal(expectedErrorMessage);
      });
    });

    it('when retrieving valid action, then return resolved promise with action data', () => {
      const expectedAction: Action = {
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

      const expectedSession: Session = {
        userId: 'someuserId',
        sessionId: 'somesessionid'
      };

      const retrieveSessionStub = sandbox.stub(SessionsService.prototype, 'get')
      .callsFake((sessionId: string) => {
        return Promise.resolve(expectedSession);
      });

      const retrieveActionStub = sandbox.stub(ActionsService.prototype, 'get')
      .callsFake((expectedActionId) => {
        return Promise.resolve(expectedAction);
      });

      return channelapeClient.getAction(expectedAction.id).then((actualAction) => {
        expect(actualAction.action).to.equal(expectedAction.action);
        expect(actualAction.businessId).to.equal(expectedAction.businessId);
        expect(actualAction.description).to.equal(expectedAction.description);
        expect(actualAction.healthCheckIntervalInSeconds).to.equal(expectedAction.healthCheckIntervalInSeconds);
        expect(actualAction.id).to.equal(expectedAction.id);
        expect(actualAction.lastHealthCheckTime).to.equal(expectedAction.lastHealthCheckTime);
        expect(actualAction.processingStatus).to.equal(expectedAction.processingStatus);
        expect(actualAction.startTime).to.equal(expectedAction.startTime);
        expect(actualAction.targetId).to.equal(expectedAction.targetId);
        expect(actualAction.targetType).to.equal(expectedAction.targetType);
      });
    });

    it('when retrieving invalid action, then return rejected promise with error', () => {
      const actionId = '676cb925-b603-4140-a3dd-2af160c257d1';

      const expectedSession: Session = {
        userId: 'someuserId',
        sessionId: 'somesessionid'
      };

      const retrieveSessionStub = sandbox.stub(SessionsService.prototype, 'get')
      .callsFake((sessionId: string) => {
        return Promise.resolve(expectedSession);
      });

      const expectedChannelApeErrorResponse : ChannelApeErrorResponse = {
        statusCode: 404,
        errors: [
          {
            code: 111,
            message: 'Action could not be found.'
          }
        ]
      };

      const retrieveActionStub = sandbox.stub(ActionsService.prototype, 'get')
      .callsFake((actionId) => {
        return Promise.reject(expectedChannelApeErrorResponse);
      });

      return channelapeClient.getAction(actionId).then((actualAction) => {
        throw new Error('Expected rejected promise');
      }).catch((error) => {
        const actualChannelApeErrorResponse = error as ChannelApeErrorResponse;
        expect(actualChannelApeErrorResponse.statusCode).to.equal(404);
        expect(actualChannelApeErrorResponse.errors.length).to.equal(1);
        expect(actualChannelApeErrorResponse.errors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.errors[0].message)
          .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      });
    });

  });  

  describe('given some channelape client configuration, created with empty user credentials and session ID', () => {

    const clientConfiguration : ClientConfiguration
      = new ClientConfigurationBuilder().setEndpoint(someEndpoint).build();
    const channelapeClient : ChannelapeClient = new ChannelapeClient(clientConfiguration);

    it('when getting session, then return reject promise with error', () => {
      const expectedErrorMessage : string = 'Invalid configuration. username and password or session ID is required.';
      return channelapeClient.getSession().catch((error) => {
        expect(error).to.equal(expectedErrorMessage);
      });
    });

  });

  function generateCredentialSessionClient(): ChannelapeClient {
    const clientConfiguration : ClientConfiguration
      = new ClientConfigurationBuilder().setUsername('someusername@channelape.com')
      .setPassword('somepassword').setEndpoint(someEndpoint).build();
    return  new ChannelapeClient(clientConfiguration);
  }

  function generateSessionIdClient(): ChannelapeClient {
    const clientConfiguration : ClientConfiguration
      = new ClientConfigurationBuilder().setSessionId('123')
      .setEndpoint(someEndpoint).build();
    return  new ChannelapeClient(clientConfiguration);
  }
});
