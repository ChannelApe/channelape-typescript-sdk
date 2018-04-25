import ChannelapeClient from './../src/ChannelapeClient';
import { expect } from 'chai';
import SessionRetrievalService from './../src/auth/service/SessionRetrievalService';
import * as sinon from 'sinon';
import SessionResponse from './../src/auth/model/SessionResponse';
import CredentialSessionRequest from './../src/auth/model/CredentialSessionRequest';
import SessionIdSessionRequest from './../src/auth/model/SessionIdSessionRequest';
import ClientConfiguration from './../src/model/ClientConfiguration';
import ClientConfigurationBuilder from './../src/model/ClientConfigurationBuilder';

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
      const expectedSession: SessionResponse = {
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

  describe('given some channelape client configuration, created with user credentials', () => {
    const channelapeClient : ChannelapeClient = generateSessionIdClient();

    it('when getting session for a valid user, then return resolved promise with session data', () => {
      const expectedSession: SessionResponse = {
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
