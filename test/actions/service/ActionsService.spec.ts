import { expect } from 'chai';
import * as sinon from 'sinon';
import * as request from 'request';
import { LogLevel } from 'channelape-logger';
import ActionsService from './../../../src/actions/service/ActionsService';
import ActionsQueryRequest from '../../../src/actions/model/ActionsQueryRequest';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Subresource from '../../../src/actions/model/Subresource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import Action from '../../../src/actions/model/Action';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import ChannelApeError from '../../../src/model/ChannelApeError';

import actionsFirstPageResponse from '../resources/actionsFirstPageResponse';
import actionsFinalPageResponse from '../resources/actionsFinalPageResponse';

describe('Actions Service', () => {

  describe('Given some rest client', () => {
    const client: RequestClientWrapper =
      new RequestClientWrapper(
        request.defaults({
          baseUrl: Environment.STAGING,
          timeout: 60000, 
          json: true
        }),
        LogLevel.OFF,
        Environment.STAGING
      );

    let sandbox: sinon.SinonSandbox;

    const expectedErrorAction = {
      action: 'PRODUCT_PULL',
      businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
      description: 'Encountered error during product pull for Europa Sports',
      healthCheckIntervalInSeconds: 300,
      id: 'a85d7463-a2f2-46ae-95a1-549e70ecb2ca',
      lastHealthCheckTime: '2018-04-24T14:02:34.703Z',
      processingStatus: 'error',
      startTime: '2018-04-24T14:02:34.703Z',
      targetId: '1e4ebaa6-9796-4ccf-bd73-8765893a66bd',
      targetType: 'supplier'
    };

    const expectedCompletedAction = {
      action: 'PRODUCT_PUSH',
      businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
      description: 'Completed product push for Custom Column Export',
      healthCheckIntervalInSeconds: 300,
      id: '4da63571-a4c5-4774-ae20-4fee24ab98e5',
      lastHealthCheckTime: '2018-05-01T14:47:58.018Z',
      processingStatus: 'completed',
      startTime: '2018-05-01T14:47:55.905Z',
      targetId: '9c728601-0286-457d-b0d6-ec19292d4485',
      targetType: 'channel',
      endTime: '2018-05-01T14:47:58.018Z'
    };

    const expectedChannelApeErrorResponse : ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        { 
          code: 111, 
          message: 'Action could not be found.' 
        }
      ]
    };

    const expectedError = {
      stack: 'oh no an error'
    };

    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('And valid action ID for error action ' +
      'When retrieving action Then return resolved promise with action', () => {

      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedErrorAction);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(expectedErrorAction.id).then((actualAction) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}`);
        expectErrorAction(expectedErrorAction);
        expect(actualAction.endTime).to.be.undefined;
      });
    });

    it('And valid action ID And request connect errors ' +
      'When retrieving action Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid action ID ' +
    'When retrieving action Then return a rejected promise with 404 status code ' +
    'And action not found error message', () => {

      const response = {
        statusCode: 404
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it('And valid action ID ' +
    'When updating action health check Then return resolved promise with action', () => {

      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedCompletedAction);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.updateHealthCheck(expectedCompletedAction.id).then((actualAction) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedCompletedAction.id}/${Subresource.HEALTH_CHECK}`);
        expectCompletedAction(actualAction);
        expect(actualAction.endTime).not.to.be.undefined;
        if (typeof actualAction.endTime === 'object') {
          expect(actualAction.endTime.toISOString()).to.equal(actualAction.endTime.toISOString());
        }
      });
    });

    it('And valid action ID And request connect errors ' +
    'When updating action health check Then return a rejected promise with an error', () => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'put')
        .yields(expectedError, null, null);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.updateHealthCheck(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}/${Subresource.HEALTH_CHECK}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid action ID ' +
    'When updating action health check Then return a rejected promise with 404 status code ' +
    'And action not found error message', () => {

      const response = {
        statusCode: 404
      };

      const clientGetStub = sandbox.stub(client, 'put')
        .yields(null, response, expectedChannelApeErrorResponse);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.updateHealthCheck(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}/${Subresource.HEALTH_CHECK}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it('And valid action ID ' +
    'When completing action Then return resolved promise with action', () => {

      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedCompletedAction);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.complete(expectedCompletedAction.id).then((actualAction) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedCompletedAction.id}/${Subresource.COMPLETE}`);
        expectCompletedAction(actualAction);
      });
    });

    it('And valid action ID And request connect errors ' +
    'When completing action Then return a rejected promise with an error', () => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'put')
        .yields(expectedError, null, null);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.complete(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}/${Subresource.COMPLETE}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid action ID ' +
    'When completing action Then return a rejected promise with 404 status code ' +
    'And action not found error message', () => {

      const response = {
        statusCode: 404
      };

      const clientGetStub = sandbox.stub(client, 'put')
        .yields(null, response, expectedChannelApeErrorResponse);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.complete(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}/${Subresource.COMPLETE}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it('And valid action ID ' +
    'When updating action with error Then return resolved promise with action', () => {

      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedErrorAction);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.error(expectedErrorAction.id).then((actualAction) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}/${Subresource.ERROR}`);
        expectErrorAction(actualAction);
      });
    });

    it('And valid action ID And request connect errors ' +
    'When updating action with error Then return a rejected promise with an error', () => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'put')
        .yields(expectedError, null, null);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.error(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}/${Subresource.ERROR}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid action ID ' +
    'When updating action with error Then return a rejected promise with 404 status code ' +
    'And action not found error message', () => {

      const response = {
        statusCode: 404
      };

      const clientGetStub = sandbox.stub(client, 'put')
        .yields(null, response, expectedChannelApeErrorResponse);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.error(expectedErrorAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedErrorAction.id}/${Subresource.ERROR}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it(`And valid Business ID When retrieving actions Then expect multiple actions to be returned`, () => {
      const clientGetStub = sandbox.stub(client, 'get');
      const response = {
        statusCode: 200
      };
      clientGetStub.onFirstCall()
        .yields(null, response, actionsFirstPageResponse);
      clientGetStub.onSecondCall()
        .yields(null, response, actionsFinalPageResponse);
      const actionsRequest: ActionsQueryRequest = {
        businessId: '4d688534-d82e-4111-940c-322ba9aec108',
        startDate: new Date('2018-05-01T18:07:58.009Z'),
        endDate: new Date('2018-05-07T18:07:58.009Z'),
        size: 50
      };
      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(actionsRequest).then((actualResponse) => {
        expect(actualResponse).to.be.an('array');
        expect(actualResponse.length).to.equal(73);
        expect(clientGetStub.args[0][0]).to.equal('/v1/actions');
        expect(clientGetStub.args[0][1].qs.startDate).to.equal('2018-05-01T18:07:58.009Z');
        expect(clientGetStub.args[0][1].qs.endDate).to.equal('2018-05-07T18:07:58.009Z');
        expect(clientGetStub.args[0][1].qs.size).to.equal(50);
        expect(clientGetStub.args[1][1].qs.startDate).to.equal('2018-05-01T18:07:58.009Z');
        expect(clientGetStub.args[1][1].qs.endDate).to.equal('2018-05-07T18:07:58.009Z');
        expect(clientGetStub.args[1][1].qs.size).to.equal(50);
      });
    });

    it(`And valid Business ID And singlePage set to true And the business has multiple pages worth of actions
        When retrieving actions
        Then expect a single page of actions to be returned`, () => {
      const clientGetStub = sandbox.stub(client, 'get');
      const response = {
        statusCode: 200
      };
      clientGetStub.onFirstCall()
        .yields(null, response, actionsFirstPageResponse);
      const actionsRequest: ActionsQueryRequest = {
        businessId: '4d688534-d82e-4111-940c-322ba9aec108',
        startDate: new Date('2018-05-01T18:07:58.009Z'),
        endDate: new Date('2018-05-07T18:07:58.009Z'),
        size: 50
      };
      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.getPage(actionsRequest).then((actualResponse) => {
        expect(actualResponse.actions).to.be.an('array');
        expect(actualResponse.actions.length).to.equal(50);
        expect(clientGetStub.args[0][0]).to.equal('/v1/actions');
        expect(clientGetStub.args[0][1].qs.startDate).to.equal('2018-05-01T18:07:58.009Z');
        expect(clientGetStub.args[0][1].qs.endDate).to.equal('2018-05-07T18:07:58.009Z');
        expect(clientGetStub.args[0][1].qs.size).to.equal(50);
      });
    });

    it(`And invalid Business ID when calling getByBusinessId() Then expect ChannelApeError to be returned`, () => {
      const clientGetStub = sandbox.stub(client, 'get');
      const response = {
        statusCode: 404
      };
      clientGetStub.yields(null, response, {
        errors: [{
          code: 15,
          message: 'Requested business cannot be found.'
        }]
      });
      const actionsRequest: ActionsQueryRequest = {
        businessId: 'not-a-real-business-id'
      };
      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(actionsRequest).then((actualResponse) => {
        throw new Error('Expected ChannelApeError');
      })
      .catch((e: ChannelApeError) => {
        expect(e.ApiErrors[0].code).to.equal(15);
        expect(e.ApiErrors[0].message).to.equal('Requested business cannot be found.');
      });
    });

    it(`And there is a request error Then expect an error to be returned`, () => {
      const clientGetStub = sandbox.stub(client, 'get');
      const response = {
        statusCode: 500
      };
      clientGetStub.yields(new Error('server went away'), response, null);
      const actionsRequest: ActionsQueryRequest = {
        businessId: 'real-business-id'
      };
      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(actionsRequest).then((actualResponse) => {
        throw new Error('Expected ChannelApeError');
      })
      .catch((e) => {
        expect(e.message).to.equal('server went away');
      });
    });

    function expectErrorAction(actualAction: any) {
      expectAction(expectedErrorAction, actualAction);
      expect(actualAction.endTime).to.equal(undefined);
    }

    function expectCompletedAction(actualAction: any) {
      expectAction(expectedCompletedAction, actualAction);
      if (actualAction.endTime == null) {
        expect(actualAction.endTime).to.not.equal(undefined);
      } else {
        expect(actualAction.endTime.toISOString())
          .to.equal(actualAction.endTime.toISOString());
      }
    }

    function expectAction(expectedAction: any, actualAction: any) {
      expect(actualAction.action).to.equal(expectedAction.action);
      expect(actualAction.businessId).to.equal(expectedAction.businessId);
      expect(actualAction.description).to.equal(expectedAction.description);
      expect(actualAction.healthCheckIntervalInSeconds).to.equal(expectedAction.healthCheckIntervalInSeconds);
      expect(actualAction.id).to.equal(expectedAction.id);
      expect(actualAction.lastHealthCheckTime.toISOString())
        .to.equal(expectedAction.lastHealthCheckTime.toISOString());
      expect(actualAction.processingStatus).to.equal(expectedAction.processingStatus);
      expect(actualAction.startTime.toISOString()).to.equal(expectedAction.startTime.toISOString());
      expect(actualAction.targetId).to.equal(expectedAction.targetId);
      expect(actualAction.targetType).to.equal(expectedAction.targetType);
    }

    function expectChannelApeErrorResponse(actualChannelApeErrorResponse: ChannelApeError) {
      expect(actualChannelApeErrorResponse.Response.statusCode).to.equal(404);
      expect(actualChannelApeErrorResponse.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(actualChannelApeErrorResponse.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
