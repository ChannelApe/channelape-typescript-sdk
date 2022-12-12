import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import LoggingService from './../../../src/logging/service/LoggingService';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';

const payload = {
  flow: 'testflow',
  body: 'test message',
};

describe('Logging Service', () => {
  describe('Given some rest client', () => {
    const client: RequestClientWrapper = new RequestClientWrapper({
      endpoint: Environment.STAGING,
      maximumRequestRetryTimeout: 10000,
      timeout: 60000,
      session: 'valid-session-id',
      logLevel: LogLevel.INFO,
      minimumRequestRetryRandomDelay: 50,
      maximumRequestRetryRandomDelay: 50,
      maximumConcurrentConnections: 5,
    });

    let sandbox: sinon.SinonSandbox;

    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('And logs a payload', () => {
      const response = {
        status: 201,
        config: {
          method: 'POST',
        },
      };

      const expectedResult = {
        flow: 'testflow',
        logtime: '2022-12-08T16:29:36.868Z',
        businessId: 'd2e9f8fa-926b-4690-ae08-c098e0220fad',
      };

      const clientPostStub: sinon.SinonStub = sandbox
        .stub(client, 'post')
        .yields(null, response, expectedResult);

      const loggingService: LoggingService = new LoggingService(client);
      return loggingService.logPayload(payload).then((result: any) => {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}/logs`);
        // console.log(JSON.stringify(clientPostStub., null, 2));
        expect(result.flow).to.equal(expectedResult.flow);
        expect(result.logtime).to.equal(expectedResult.logtime);
        expect(result.businessId).to.equal(expectedResult.businessId);
      });
    });

    it(
      'And session ID is invalid ' +
        'When retrieving session Then return rejected promise with 401 ' +
        'status code and invalid auth error message',
      () => {
        const expectedChannelApeApiErrorResponse: ChannelApeApiErrorResponse = {
          statusCode: 401,
          errors: [
            {
              code: 12,
              message:
                'Invalid authorization token. Please check the server logs and try again.',
            },
          ],
        };

        const response = {
          status: 401,
          config: {},
          data: expectedChannelApeApiErrorResponse,
        };

        const clientPostStub: sinon.SinonStub = sandbox
          .stub(client, 'post')
          .yields(null, response);

        const loggingService: LoggingService = new LoggingService(client);
        return loggingService
          .logPayload(payload)
          .then((actualResponse) => {
            expect(actualResponse).to.be.undefined;
          })
          .catch((actualChannelApeErrorResponse) => {
            expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}/logs`);
            expect(actualChannelApeErrorResponse.responseStatusCode).to.equal(
              401
            );
          });
      }
    );
  });
});
