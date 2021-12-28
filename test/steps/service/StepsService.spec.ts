import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import StepsService from './../../../src/steps/service/StepsService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import { ChannelApeError } from '../../../src/index';
import Step from '../../../src/steps/model/Step';

describe('Steps Service', () => {

  describe('Given some rest client', () => {
    const client: RequestClientWrapper =
      new RequestClientWrapper({
        endpoint: Environment.STAGING,
        maximumRequestRetryTimeout: 10000,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: 50,
        maximumRequestRetryRandomDelay: 50,
        maximumConcurrentConnections: 5
      });

    let sandbox: sinon.SinonSandbox;

    const expectedStep: Step = {
      id: '9c728601-0286-457d-b0d6-ec19292d4485',
      public: false,
      name: 'Custom Step',
      environmentVariableKeys: [{
        name: 'CHANNEL_APE_TOKEN',
        secured: true
      }, {
        name: 'MFT_USER_ID',
        secured: false,
        defaultValue: 'channelape'
      }],
      createdAt: new Date('2018-02-22T16:04:29.030Z'),
      updatedAt: new Date('2018-04-02T13:04:27.299Z')
    };

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'Step could not be found for business.'
        }
      ]
    };

    const expectedError = {
      stack: 'oh no an error'
    };

    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('And valid step ID ' +
      'When retrieving step Then return resolved promise with step', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedStep);

      const stepsService: StepsService = new StepsService(client);
      return stepsService.get(expectedStep.id).then((actualStep) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.STEPS}/${expectedStep.id}`);
        expectStep(actualStep);
      });
    });

    it('And valid step ID And request connect errors ' +
      'When retrieving step Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const stepsService: StepsService = new StepsService(client);
      return stepsService.get(expectedStep.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.STEPS}/${expectedStep.id}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid step ID ' +
      'When retrieving step Then return a rejected promise with 404 status code ' +
      'And step not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const stepsService: StepsService = new StepsService(client);
      return stepsService.get(expectedStep.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.STEPS}/${expectedStep.id}`);
        expectStepApeErrorResponse(e);
      });
    });

    function expectStep(actualStep: Step) {
      expect(actualStep.id).to.equal(expectedStep.id);
      expect(actualStep.name).to.equal(expectedStep.name);
      expect(actualStep.public).to.equal(expectedStep.public);
      expect(actualStep.environmentVariableKeys).to.deep.equal(expectedStep.environmentVariableKeys);
      expect(actualStep.createdAt.toISOString()).to.equal(expectedStep.createdAt.toISOString());
      expect(actualStep.updatedAt.toISOString()).to.equal(expectedStep.updatedAt.toISOString());
    }

    function expectStepApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
