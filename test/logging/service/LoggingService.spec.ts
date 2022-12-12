import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import LoggingService from './../../../src/logging/service/LoggingService';

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

    it('logs a payload', () => {
      const response = {
        status: 201,
        config: {
          method: 'POST',
        },
      };

      const payload = {
        flow: 'testflow',
        body: 'test message',
      };

      const expectedResult = {
        flow: 'testflow',
        logtime: '2022-12-08T16:29:36.868Z',
        businessId: 'd2e9f8fa-926b-4690-ae08-c098e0220fad',
      };

      const clientGetStub: sinon.SinonStub = sandbox
        .stub(client, 'post')
        .yields(null, response, expectedResult);

      const loggingService: LoggingService = new LoggingService(client);
      return loggingService.logPayload(payload).then((response: any) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}/logs`);
        expect(response.flow).to.equal(expectedResult.flow);
        expect(response.logtime).to.equal(expectedResult.logtime);
        expect(response.businessId).to.equal(expectedResult.businessId);
      });
    });
  });
});
