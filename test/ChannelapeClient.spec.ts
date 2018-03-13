import { ChannelapeClient } from './../src/ChannelapeClient';
import { expect } from 'chai';
import SessionRetrievalService from './../src/auth/service/SessionRetrievalService';
import * as sinon from 'sinon';
import SessionResponse from './../src/auth/model/SessionResponse';
import SessionRequest from './../src/auth/model/SessionRequest';

describe('Channelape Client', () => {
  describe('given some channelape client configuration', () => {
    const someChannelapeConfiguration  = {
      endpoint: 'some-endpoint.com'
    };

    let sandbox;
    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });
    
    it('when creating a channelape client, then create channelape client', () => {
      const channelapeClient = new ChannelapeClient(someChannelapeConfiguration);
      expect(channelapeClient).to.not.be.undefined;
    });

    it('when getting session for a valid user, then return resolved promise with session data', () => {
      const channelapeClient = new ChannelapeClient(someChannelapeConfiguration);

      const expectedSession: SessionResponse = {
        userId: 'someuserId',
        sessionId: 'some password'
      };
      const retrieveSessionStub = sandbox.stub(SessionRetrievalService.prototype, 'retrieveSession')
      .callsFake((sessionRequest: SessionRequest) => {
        return Promise.resolve(expectedSession);
      });
      return channelapeClient.getSession().then((session) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(session).to.equal(expectedSession);
      });
    });

    it('when getting session for a invalid user, then return reject promise with error', () => {
      const channelapeClient = new ChannelapeClient(someChannelapeConfiguration);

      const expectedSession: SessionResponse = {
        userId: 'someuserId',
        sessionId: 'some password'
      };
      const expectedErrorMessage = 'There was an error';

      const retrieveSessionStub = sandbox.stub(SessionRetrievalService.prototype, 'retrieveSession')
      .callsFake((sessionRequest: SessionRequest) => {
        return Promise.reject('There was an error');
      });

      return channelapeClient.getSession().catch((error) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(error).to.equal(expectedErrorMessage);
      });
    });
  });  
});
