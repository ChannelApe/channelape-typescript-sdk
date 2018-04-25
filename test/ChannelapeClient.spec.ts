import ChannelapeClient from './../src/ChannelapeClient';
import { expect } from 'chai';
import SessionRetrievalService from './../src/sessions/service/SessionRetrievalService';
import * as sinon from 'sinon';
import Session from './../src/sessions/model/Session';
import CredentialSessionRequest from './../src/sessions/model/CredentialSessionRequest';
import SessionIdSessionRequest from './../src/sessions/model/SessionIdSessionRequest';
import ClientConfiguration from './../src/model/ClientConfiguration';
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
      const retrieveSessionStub : sinon.SinonStub = sandbox.stub(SessionRetrievalService.prototype, 'retrieveSession')
      .callsFake((sessionRequest: CredentialSessionRequest) => {
        return Promise.resolve(expectedSession);
      });
      return channelapeClient.getSession().then((session) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(session).to.equal(expectedSession);
      });
    });

    it('when getting session for a invalid session, then return reject promise with error', () => {
      const expectedErrorMessage : string = 'There was an error';

      const retrieveSessionStub : sinon.SinonStub = sandbox.stub(SessionRetrievalService.prototype, 'retrieveSession')
      .callsFake((sessionRequest: CredentialSessionRequest) => {
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
        sessionId: 'some password'
      };
      const retrieveSessionStub = sandbox.stub(SessionRetrievalService.prototype, 'retrieveSession')
      .callsFake((sessionRequest: SessionIdSessionRequest) => {
        return Promise.resolve(expectedSession);
      });
      return channelapeClient.getSession().then((session) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(session).to.equal(expectedSession);
      });
    });

    it('when getting session for a invalid session, then return reject promise with error', () => {
      const expectedErrorMessage : string = 'There was an error';

      const retrieveSessionStub : sinon.SinonStub = sandbox.stub(SessionRetrievalService.prototype, 'retrieveSession')
      .callsFake((sessionRequest: SessionIdSessionRequest) => {
        return Promise.reject('There was an error');
      });

      return channelapeClient.getSession().catch((error) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(error).to.equal(expectedErrorMessage);
      });
    });

    it('when retrieving valid action, then return resolved promise with action data', () => {
      const expectedActionId = 'a85d7463-a2f2-46ae-95a1-549e70ecb2ca';
      return channelapeClient.getAction(expectedActionId).then((actualAction) => {
        expect(actualAction.action).to.equal('PRODUCT_PULL');
        expect(actualAction.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
        expect(actualAction.description).to.equal('Encountered error during product pull for Europa Sports');
        expect(actualAction.healthCheckIntervalInSeconds).to.equal(300);
        expect(actualAction.id).to.equal(expectedActionId);
        expect(actualAction.lastHealthCheckTime).to.equal('2018-04-24T14:02:34.703Z');
        expect(actualAction.processingStatus).to.equal('error');
        expect(actualAction.startTime).to.equal('2018-04-24T14:02:34.703Z');
        expect(actualAction.targetId).to.equal('1e4ebaa6-9796-4ccf-bd73-8765893a66bd');
        expect(actualAction.targetType).to.equal('supplier');
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
