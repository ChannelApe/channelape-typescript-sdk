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
    it('when creating a channelape client, then create channelape client', () => {
      const channelapeClient = new ChannelapeClient(someChannelapeConfiguration);
      expect(channelapeClient).to.not.be.undefined;
    });

    it('when getting session, then retrieve session data', () => {
      const channelapeClient = new ChannelapeClient(someChannelapeConfiguration);

      const expectedSession: SessionResponse = {
        userId: 'someuserId',
        sessionId: 'some password'
      };
      const retrieveSessionStub = sinon.stub(SessionRetrievalService.prototype, 'retrieveSession')
      .callsFake((sessionRequest: SessionRequest) => {
        return Promise.resolve(expectedSession);
      });
      channelapeClient.getSession().then((session) => {
        expect(retrieveSessionStub.callCount).to.equal(1);
        expect(session).to.equal(expectedSession);
      });
    });
  });  
});
