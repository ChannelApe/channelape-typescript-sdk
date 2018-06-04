import { expect } from 'chai';
import * as sinon from 'sinon';
import request = require('request');
import SessionsService from './../../../src/sessions/service/SessionsService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';

describe('Sessions Service', () => {

  describe('Given some rest client and session ID ', () => {
    const client = request.defaults({
      baseUrl: Environment.STAGING,
      timeout: 60000,
      json: true
    });
    const sessionId = 'b40da0b8-a770-4de7-a496-361254bd7d6c';
    const userId = 'f6ed6f7a-47bf-4dd3-baed-71a8a9684e80';
    const sessionsService = new SessionsService(client, sessionId);

    let sandbox: sinon.SinonSandbox;

    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('And session ID is valid ' +
      'When retrieving session Then return resolved promise with session data', () => {

      const expectedResponse = {
        sessionId,
        userId
      };

      const response = {
        statusCode: 200
      };

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedResponse);

      return sessionsService.get().then((actualResponse) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SESSIONS}/${sessionId}`);
        expect(actualResponse.userId).to.equal(expectedResponse.userId);
        expect(actualResponse.sessionId).to.equal(expectedResponse.sessionId);
      });
    });

    it('And session ID is valid And request connect errors ' +
      'When retrieving session Then return a rejected promise with an error', (done) => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      sessionsService.get().then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SESSIONS}/${sessionId}`);
        expect(e).to.be.equal(expectedError);
        done();
      });
    });

    it('And session ID is invalid ' +
      'When retrieving session Then return rejected promise with 401 ' +
      'status code and invalid auth error message', (done) => {

      const response = {
        statusCode: 401
      };
      const expectedChannelApeApiErrorResponse : ChannelApeApiErrorResponse = {
        statusCode: 401,
        errors: [
          {
            code: 12,
            message: 'Invalid authorization token. Please check the server logs and try again.'
          }
        ]
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeApiErrorResponse);

      sessionsService.get().then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SESSIONS}/${sessionId}`);
        const actualChannelApeErrorResponse = e as ChannelApeApiErrorResponse;
        expect(actualChannelApeErrorResponse.statusCode).to.equal(401);
        expect(actualChannelApeErrorResponse.errors.length).to.equal(1);
        expect(actualChannelApeErrorResponse.errors[0].code)
          .to.equal(expectedChannelApeApiErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.errors[0].message)
          .to.equal(expectedChannelApeApiErrorResponse.errors[0].message);
        done();
      });
    });
  });
});
