import { expect } from 'chai';
import * as sinon from 'sinon';
import request = require('request');
import SessionRetrievalService from './../../../src/auth/service/SessionRetrievalService';
import Version from '../../../src/model/Version';
import Endpoint from '../../../src/model/Endpoint';
import Environment from '../../../src/model/Environment';
import ChannelApeErrorResponse from '../../../src/model/ChannelApeErrorResponse';
import SessionResponse from '../../../src/auth/model/SessionResponse';

describe('Session Retrieval Service', () => {

  describe('given some rest client and some given endpoint', () => {
    const someEndpoint: string = Environment.STAGING;
    const client = request.defaults({
      timeout: 60000
    });

    let sandbox: sinon.SinonSandbox;

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

      const expectedResponse: SessionResponse = {
        sessionId: 'some-session-id',
        userId: 'some-user-id'
      };

      const response = {
        statusCode: 201
      };
      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedResponse);


      const expectedEmail: string = 'some-email@email.com';
      const expectedPassword: string = 'some-crazy-long-password';

      const sessionRetrievalService: SessionRetrievalService = new SessionRetrievalService(client, someEndpoint);
      return sessionRetrievalService.retrieveSession({
        email: expectedEmail,
        password: expectedPassword
      }).then((actualResponse) => {
        expect(clientPostStub.args[0][0]).to.equal(`${someEndpoint}/${Version.V1}${Endpoint.SESSIONS}`);

        const actualOptions: request.CoreOptions = clientPostStub.args[0][1];
        expect(actualOptions.json).to.equal(true);
        const actualAuth = actualOptions.auth;
        if (actualAuth == null) {
          expect(actualAuth).to.not.be.undefined;
        } else {
          expect(actualAuth.username).to.equal(expectedEmail);
          expect(actualAuth.password).to.equal(expectedPassword);
        }

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

      const response = {
        statusCode: 200
      };
        
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedResponse);

      const sessionRetrievalService = new SessionRetrievalService(client, someEndpoint);
      const someSessionId = '123';
      return sessionRetrievalService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`${someEndpoint}/${Version.V1}${Endpoint.SESSIONS}/${someSessionId}`);
        
        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        expect(actualOptions.json).to.equal(true);

        expect(actualResponse.userId).to.equal(expectedResponse.userId);
        expect(actualResponse.sessionId).to.equal(expectedResponse.sessionId);
      });
    });


    it('given valid credential session request ' +
      'when request connect errors, then return a rejected promise with an error', (done) => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientPostStub = sandbox.stub(client, 'post')
        .yields(expectedError, null, null);
        
      const expectedEmail: string = 'some-email@email.com';
      const expectedPassword: string = 'some-crazy-long-password';

      const sessionRetrievalService: SessionRetrievalService = new SessionRetrievalService(client, someEndpoint);
      sessionRetrievalService.retrieveSession({
        email: expectedEmail,
        password: expectedPassword
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientPostStub.args[0][0]).to.equal(`${someEndpoint}/${Version.V1}${Endpoint.SESSIONS}`);
        
        const actualOptions: request.CoreOptions = clientPostStub.args[0][1];
        expect(actualOptions.json).to.equal(true);
        const actualAuth = actualOptions.auth;

        if (actualAuth == null) {
          expect(actualAuth).to.not.be.undefined;
        } else {
          expect(actualAuth.username).to.equal(expectedEmail);
          expect(actualAuth.password).to.equal(expectedPassword);
        }

        expect(e).to.be.equal(expectedError);
        done();
      });
    });

    it('given credential session request with invalid password' +
    'when retrieving session, then return a rejected promise with 401 status code ' +
    'and invalid email or password error message', (done) => {

      const response = {
        statusCode: 401
      };
      const expectedChannelApeErrorResponse : ChannelApeErrorResponse = {
        statusCode: 401,
        errors: [
          { 
            code: 12, 
            message: 'Invalid authorization token. Please check the server logs and try again.' 
          }
        ]
      };
      const clientPostStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedChannelApeErrorResponse);
        
      const expectedEmail: string = 'some-email@email.com';
      const expectedPassword: string = 'some-crazy-long-password';

      const sessionRetrievalService: SessionRetrievalService = new SessionRetrievalService(client, someEndpoint);
      sessionRetrievalService.retrieveSession({
        email: expectedEmail,
        password: expectedPassword
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientPostStub.args[0][0]).to.equal(`${someEndpoint}/${Version.V1}${Endpoint.SESSIONS}`);
        
        const actualOptions: request.CoreOptions = clientPostStub.args[0][1];
        expect(actualOptions.json).to.equal(true);
        const actualAuth = actualOptions.auth;

        if (actualAuth == null) {
          expect(actualAuth).to.not.be.undefined;
        } else {
          expect(actualAuth.username).to.equal(expectedEmail);
          expect(actualAuth.password).to.equal(expectedPassword);
        }
        
        const actualChannelApeErrorResponse = e as ChannelApeErrorResponse;
        expect(actualChannelApeErrorResponse.statusCode).to.equal(401);
        expect(actualChannelApeErrorResponse.errors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.errors[0].message)
          .to.equal(expectedChannelApeErrorResponse.errors[0].message);
        done();
      });
    });

    it('given valid sessionId session request ' +
      'when request connect errors, then return a rejected promise with an error', (done) => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const sessionRetrievalService = new SessionRetrievalService(client, someEndpoint);
      const someSessionId = '123';
      sessionRetrievalService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`${someEndpoint}/${Version.V1}${Endpoint.SESSIONS}/${someSessionId}`);

        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        expect(actualOptions.json).to.equal(true);

        expect(e).to.be.equal(expectedError);
        done();
      });
    });

    it('given invalid sessionId session request ' +
      'when retrieving session then return rejected promise with 401 ' +
      'status code and invalid auth error message', (done) => {

      const response = {
        statusCode: 401
      };
      const expectedChannelApeErrorResponse : ChannelApeErrorResponse = {
        statusCode: 401,
        errors: [
          { 
            code: 12, 
            message: 'Invalid authorization token. Please check the server logs and try again.' 
          }
        ]
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const sessionRetrievalService = new SessionRetrievalService(client, someEndpoint);
      const someSessionId = '123';
      sessionRetrievalService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`${someEndpoint}/${Version.V1}${Endpoint.SESSIONS}/${someSessionId}`);

        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        expect(actualOptions.json).to.equal(true);

        const actualChannelApeErrorResponse = e as ChannelApeErrorResponse;
        expect(actualChannelApeErrorResponse.statusCode).to.equal(401);
        expect(actualChannelApeErrorResponse.errors.length).to.equal(1);
        expect(actualChannelApeErrorResponse.errors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.errors[0].message)
          .to.equal(expectedChannelApeErrorResponse.errors[0].message);
        done();
      });
    });
  });
});
