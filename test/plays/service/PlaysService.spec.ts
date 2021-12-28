import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import { ChannelApeError } from '../../../src/index';
import PlaysService from '../../../src/plays/service/PlaysService';
import Play from '../../../src/plays/model/Play';
import StepsService from '../../../src/steps/service/StepsService';

describe('Plays Service', () => {

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
    const stepsService: StepsService = new StepsService(client);

    const expectedPlay: Play = {
      id: '9c728601-0286-457d-b0d6-ec19292d4485',
      name: 'Custom Play',
      createdAt: new Date('2018-02-22T16:04:29.030Z'),
      updatedAt: new Date('2018-04-02T13:04:27.299Z'),
      steps: [
        {
          environmentVariableKeys: [],
          id: '3803b9ff-e3f3-4762-9642-9bdf1f6504a0',
          name: 'Order Management',
          public: true,
          createdAt: new Date('2018-02-22T16:04:29.030Z'),
          updatedAt: new Date('2018-04-02T13:04:27.299Z'),
        },
        {
          environmentVariableKeys: [],
          id: '78417f87-82ff-4e82-a0eb-674b52305bc1',
          name: 'CSV - Send Order',
          public: true,
          createdAt: new Date('2018-02-22T16:04:29.030Z'),
          updatedAt: new Date('2018-04-02T13:04:27.299Z'),
        }
      ]
    };

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'Play could not be found for business.'
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

    it('And valid Play ID ' +
      'When retrieving Play Then return resolved promise with Play', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedPlay);

      const playsService: PlaysService = new PlaysService(client, stepsService);
      return playsService.get(expectedPlay.id).then((actualPlay) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V2}${Resource.PLAYS}/${expectedPlay.id}`);
        expectPlay(actualPlay);
      });
    });

    it('And valid Play ID And request connect errors ' +
      'When retrieving Play Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const playsService: PlaysService = new PlaysService(client, stepsService);
      return playsService.get(expectedPlay.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V2}${Resource.PLAYS}/${expectedPlay.id}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid Play ID ' +
      'When retrieving Play Then return a rejected promise with 404 status code ' +
      'And Play not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const playsService: PlaysService = new PlaysService(client, stepsService);
      return playsService.get(expectedPlay.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V2}${Resource.PLAYS}/${expectedPlay.id}`);
        expectPlayApeErrorResponse(e);
      });
    });

    function expectPlay(actualPlay: Play) {
      expect(actualPlay.id).to.equal(expectedPlay.id);
      expect(actualPlay.name).to.equal(expectedPlay.name);
      expect(actualPlay.createdAt.toISOString()).to.equal(expectedPlay.createdAt.toISOString());
      expect(actualPlay.updatedAt.toISOString()).to.equal(expectedPlay.updatedAt.toISOString());
      expect(actualPlay.steps[0].environmentVariableKeys).to.equal(expectedPlay.steps[0].environmentVariableKeys);
      expect(actualPlay.steps[0].id).to.equal(expectedPlay.steps[0].id);
      expect(actualPlay.steps[0].name).to.equal(expectedPlay.steps[0].name);
      expect(actualPlay.steps[0].createdAt.toISOString()).to.equal(expectedPlay.steps[0].createdAt.toISOString());
      expect(actualPlay.steps[0].updatedAt.toISOString()).to.equal(expectedPlay.steps[0].updatedAt.toISOString());
    }

    function expectPlayApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
