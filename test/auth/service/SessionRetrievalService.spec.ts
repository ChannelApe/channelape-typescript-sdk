import { expect } from 'chai';
import * as sinon from 'sinon';
import { Client } from 'node-rest-client';
import SessionRetrievalService from './../../../src/auth/service/SessionRetrievalService';
import { mockResponse } from '../../helper/mockResponse';

describe('Session Retrieval Service', () => {

  describe('given some rest client and some given endpoint', () => {
    const someEndpoint = 'https://some-api.channelape.com';
    const someClient = new Client();

    it('given valid session request' +
      'when retrieving session request then return resolved promise with session data', () => {

      const expectedResponse = {
        sessionId: 'some-session-id',
        userId: 'some-user-id'
      };
      sinon.stub(someClient, 'post').callsFake(mockResponse(expectedResponse, 200));
      const sessionRetrievalService = new SessionRetrievalService(someClient, someEndpoint);
      return sessionRetrievalService.retrieveSession({
        email: 'some-email@email.com',
        password: 'some-crazy-long-password'
      }).then((actualResponse) => {
        expect(actualResponse.userId).to.equal(expectedResponse.userId);
        expect(actualResponse.sessionId).to.equal(expectedResponse.sessionId);
      });
    });

  });
});
