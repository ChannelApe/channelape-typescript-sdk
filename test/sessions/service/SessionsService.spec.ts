import { expect } from 'chai';
import * as sinon from 'sinon';
import { LogLevel } from 'channelape-logger';
import axios from 'axios';

import SessionsService from './../../../src/sessions/service/SessionsService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import RequestClientWrapper from '../../../src/RequestClientWrapper';

describe('Sessions Service', () => {

  describe('Given some rest client and session ID ', () => {
    const client: RequestClientWrapper =
      new RequestClientWrapper(
        60000,
        'valid-session-id',
        LogLevel.OFF,
        Environment.STAGING,
        10000,
        50,
        50
      );
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
        status: 200,
        config: {},
        data: expectedResponse
      };

      const clientGetStub = sandbox.stub(axios, 'get').resolves(response);

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
      'status code and invalid auth error message', () => {

      const expectedChannelApeApiErrorResponse : ChannelApeApiErrorResponse = {
        statusCode: 401,
        errors: [
          {
            code: 12,
            message: 'Invalid authorization token. Please check the server logs and try again.'
          }
        ]
      };
      const response = {
        status: 401,
        config: {},
        data: expectedChannelApeApiErrorResponse
      };
      const clientGetStub = sandbox.stub(axios, 'get').resolves(response);

      return sessionsService.get().then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((actualChannelApeErrorResponse) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.SESSIONS}/${sessionId}`);
        expect(actualChannelApeErrorResponse.responseStatusCode).to.equal(401);
        expect(actualChannelApeErrorResponse.ApiErrors.length).to.equal(1);
        expect(actualChannelApeErrorResponse.ApiErrors[0].code)
          .to.equal(expectedChannelApeApiErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.ApiErrors[0].message)
          .to.equal(expectedChannelApeApiErrorResponse.errors[0].message);
      });
    });
  });
});
