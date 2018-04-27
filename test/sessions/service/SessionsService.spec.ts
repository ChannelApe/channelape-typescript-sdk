import { expect } from 'chai';
import * as sinon from 'sinon';
import request = require('request');
import SessionsService from './../../../src/sessions/service/SessionsService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeErrorResponse from '../../../src/model/ChannelApeErrorResponse';
import Session from '../../../src/sessions/model/Session';

describe('Sessions Service', () => {

  describe('Given some rest client', () => {
    const client = request.defaults({
      baseUrl: Environment.STAGING,
      timeout: 60000,
      json: true
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

    it('And valid credential session request ' +
      'When retrieving session request Then return resolved promise with session data', () => {

      const expectedResponse: Session = {
        sessionId: 'some-session-id',
        userId: 'some-user-id'
      };

      const response = {
        statusCode: 201
      };
      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedResponse);


      const expectedUsername: string = 'some-username@username.com';
      const expectedPassword: string = 'some-crazy-long-password';

      const sessionsService: SessionsService = new SessionsService(client);
      return sessionsService.retrieveSession({
        username: expectedUsername,
        password: expectedPassword
      }).then((actualResponse) => {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SESSIONS}`);

        const actualOptions: request.CoreOptions = clientPostStub.args[0][1];
        expect(actualOptions.json).to.equal(true);
        const actualAuth = actualOptions.auth;
        if (actualAuth == null) {
          expect(actualAuth).to.not.be.undefined;
        } else {
          expect(actualAuth.username).to.equal(expectedUsername);
          expect(actualAuth.password).to.equal(expectedPassword);
        }

        expect(actualResponse.userId).to.equal(expectedResponse.userId);
        expect(actualResponse.sessionId).to.equal(expectedResponse.sessionId);
      });
    });

    it('And valid sessionId session request' +
      'When retrieving session request Then return resolved promise with session data', () => {

      const expectedResponse = {
        sessionId: 'some-session-id',
        userId: 'some-user-id'
      };

      const response = {
        statusCode: 200
      };
        
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedResponse);

      const sessionsService = new SessionsService(client);
      const someSessionId = '123';
      return sessionsService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SESSIONS}/${someSessionId}`);
        
        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        expect(actualOptions.json).to.equal(true);

        expect(actualResponse.userId).to.equal(expectedResponse.userId);
        expect(actualResponse.sessionId).to.equal(expectedResponse.sessionId);
      });
    });


    it('And valid credential session request ' +
      'When request connect errors, Then return a rejected promise with an error', (done) => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientPostStub = sandbox.stub(client, 'post')
        .yields(expectedError, null, null);
        
      const expectedUsername: string = 'some-username@username.com';
      const expectedPassword: string = 'some-crazy-long-password';

      const sessionsService: SessionsService = new SessionsService(client);
      sessionsService.retrieveSession({
        username: expectedUsername,
        password: expectedPassword
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SESSIONS}`);
        
        const actualOptions: request.CoreOptions = clientPostStub.args[0][1];
        expect(actualOptions.json).to.equal(true);
        const actualAuth = actualOptions.auth;

        if (actualAuth == null) {
          expect(actualAuth).to.not.be.undefined;
        } else {
          expect(actualAuth.username).to.equal(expectedUsername);
          expect(actualAuth.password).to.equal(expectedPassword);
        }

        expect(e).to.be.equal(expectedError);
        done();
      });
    });

    it('And credential session request with invalid password' +
    ' When retrieving session, Then return a rejected promise with 401 status code ' +
    'And invalid username or password error message', (done) => {

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
        
      const expectedUsername: string = 'some-username@username.com';
      const expectedPassword: string = 'some-crazy-long-password';

      const sessionsService: SessionsService = new SessionsService(client);
      sessionsService.retrieveSession({
        username: expectedUsername,
        password: expectedPassword
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SESSIONS}`);
        
        const actualOptions: request.CoreOptions = clientPostStub.args[0][1];
        expect(actualOptions.json).to.equal(true);
        const actualAuth = actualOptions.auth;

        if (actualAuth == null) {
          expect(actualAuth).to.not.be.undefined;
        } else {
          expect(actualAuth.username).to.equal(expectedUsername);
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

    it('And valid sessionId session request ' +
      'When request connect errors, Then return a rejected promise with an error', (done) => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const sessionsService = new SessionsService(client);
      const someSessionId = '123';
      sessionsService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SESSIONS}/${someSessionId}`);

        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        expect(actualOptions.json).to.equal(true);

        expect(e).to.be.equal(expectedError);
        done();
      });
    });

    it('And invalid sessionId session request ' +
      'When retrieving session Then return rejected promise with 401 ' +
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

      const sessionsService = new SessionsService(client);
      const someSessionId = '123';
      sessionsService.retrieveSession({
        sessionId: someSessionId
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SESSIONS}/${someSessionId}`);

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
