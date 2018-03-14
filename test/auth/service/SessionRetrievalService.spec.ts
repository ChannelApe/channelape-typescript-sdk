import { expect } from 'chai';
import * as sinon from 'sinon';
import { Client } from 'node-rest-client';
import SessionRetrievalService from './../../../src/auth/service/SessionRetrievalService';
import { mockResponse } from '../../helper/mockResponse';
import { EventEmitter } from 'events';
import { Versions } from '../../../src/model/Versions';
import { Endpoints } from '../../../src/model/Endpoints';

describe('Session Retrieval Service', () => {

  describe('given some rest client and some given endpoint', () => {
    const someEndpoint = 'https://some-api.channelape.com';
    const someClient = new Client();

    let sandbox;

    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('given valid credential session request ' +
      'when retrieving session request then return resolved promise with session data', () => {

      const expectedResponse = {
        sessionId: 'some-session-id',
        userId: 'some-user-id'
      };
      const someClientPostStub = sandbox.stub(someClient, 'post').callsFake(mockResponse(expectedResponse, 200));

      const sessionRetrievalService = new SessionRetrievalService(someClient, someEndpoint);
      return sessionRetrievalService.retrieveSession({
        email: 'some-email@email.com',
        password: 'some-crazy-long-password'
      }).then((actualResponse) => {
        expect(someClientPostStub.args[0][0]).to.equal(`${someEndpoint}/${Versions.V1}${Endpoints.SESSIONS}`);
        expect(someClientPostStub.args[0][1]).to.deep.equal([]);
        expect(actualResponse.userId).to.equal(expectedResponse.userId);
        expect(actualResponse.sessionId).to.equal(expectedResponse.sessionId);
      });
    });

    it('given valid sessionId session request' +
      'when retrieving session request then return resolved promise with session data', () => {

      const expectedResponse = {
        sessionId: 'some-session-id',
        userId: 'some-user-id'
      };
      const someClientGetStub = sandbox.stub(someClient, 'get').callsFake(mockResponse(expectedResponse, 200));

      const sessionRetrievalService = new SessionRetrievalService(someClient, someEndpoint);
      const someSessionId = '123';
      return sessionRetrievalService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(someClientGetStub.args[0][0])
        .to.equal(`${someEndpoint}/${Versions.V1}${Endpoints.SESSIONS}/${someSessionId}`);
        expect(someClientGetStub.args[0][1]).to.deep.equal([]);
        expect(actualResponse.userId).to.equal(expectedResponse.userId);
        expect(actualResponse.sessionId).to.equal(expectedResponse.sessionId);
      });
    });


    it('given valid credential session request ' +
      'when request connect errors, then return a rejected promise with an error', (done) => {

      const emitter = new EventEmitter();
      const someClientPostStub = sandbox.stub(someClient, 'post').callsFake(() => emitter);
      const fatalExceptionMessage = 'Fatal Exception Occurred';

      const sessionRetrievalService = new SessionRetrievalService(someClient, someEndpoint);
      sessionRetrievalService.retrieveSession({
        email: 'some-email@email.com',
        password: 'some-crazy-long-password'
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(someClientPostStub.args[0][0]).to.equal(`${someEndpoint}/${Versions.V1}${Endpoints.SESSIONS}`);
        expect(someClientPostStub.args[0][1]).to.deep.equal([]);
        expect(e).to.be.equal(fatalExceptionMessage);
        done();
      });
        
      emitter.emit('error', fatalExceptionMessage);
    });

    it('given valid sessionId session request ' +
      'when request connect errors, then return a rejected promise with an error', (done) => {

      const emitter = new EventEmitter();
      const someClientPostStub = sandbox.stub(someClient, 'get').callsFake(() => emitter);
      const fatalExceptionMessage = 'Fatal Exception Occurred';

      const sessionRetrievalService = new SessionRetrievalService(someClient, someEndpoint);
      const someSessionId = '123';
      sessionRetrievalService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(someClientPostStub.args[0][0])
        .to.equal(`${someEndpoint}/${Versions.V1}${Endpoints.SESSIONS}/${someSessionId}`);
        expect(someClientPostStub.args[0][1]).to.deep.equal([]);
        expect(e).to.be.equal(fatalExceptionMessage);
        done();
      });
        
      emitter.emit('error', fatalExceptionMessage);
    });
  });
});
