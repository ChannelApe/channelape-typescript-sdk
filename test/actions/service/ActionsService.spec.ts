import { expect } from 'chai';
import * as sinon from 'sinon';
import request = require('request');
import ActionsService from './../../../src/actions/service/ActionsService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeErrorResponse from '../../../src/model/ChannelApeErrorResponse';
import Action from '../../../src/actions/model/Action';

describe('Actions Service', () => {

  describe('Given some rest client', () => {
    const client = request.defaults({
      baseUrl: Environment.STAGING,
      timeout: 60000,
      json: true
    });

    let sandbox: sinon.SinonSandbox;

    const expectedSessionId: string = '404040404';

    const expectedAction: Action = {
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

    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('And valid session ID And valid action ID ' +
      'When retrieving action Then return resolved promise with action', () => {

      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedAction);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(expectedSessionId, expectedAction.id).then((actualAction) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedAction.id}`);
        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        const actualHeaders = actualOptions.headers;
        if (actualHeaders == null) {
          expect(actualHeaders).to.not.be.undefined;
        } else {
          expect(actualHeaders['X-Channel-Ape-Authorization-Token']).to.equal(expectedSessionId);
        }

        expect(actualAction.action).to.equal(expectedAction.action);
        expect(actualAction.businessId).to.equal(expectedAction.businessId);
        expect(actualAction.description).to.equal(expectedAction.description);
        expect(actualAction.healthCheckIntervalInSeconds).to.equal(expectedAction.healthCheckIntervalInSeconds);
        expect(actualAction.id).to.equal(expectedAction.id);
        expect(actualAction.lastHealthCheckTime).to.equal(expectedAction.lastHealthCheckTime);
        expect(actualAction.processingStatus).to.equal(expectedAction.processingStatus);
        expect(actualAction.startTime).to.equal(expectedAction.startTime);
        expect(actualAction.targetId).to.equal(expectedAction.targetId);
        expect(actualAction.targetType).to.equal(expectedAction.targetType);
      });
    });

    it('And valid session ID And valid action ID And request connect errors ' +
      'When retrieving action Then return a rejected promise with an error', () => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(expectedSessionId, expectedAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedAction.id}`);
        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        const actualHeaders = actualOptions.headers;
        if (actualHeaders == null) {
          expect(actualHeaders).to.not.be.undefined;
        } else {
          expect(actualHeaders['X-Channel-Ape-Authorization-Token']).to.equal(expectedSessionId);
        }

        expect(e).to.be.equal(expectedError);
      });
    });

    it('And valid session ID And invalid action ID ' +
    'When retrieving session Then return a rejected promise with 404 status code ' +
    'And action not found error message', () => {

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

      const actionsService: ActionsService = new ActionsService(client);
      return actionsService.get(expectedSessionId, expectedAction.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ACTIONS}/${expectedAction.id}`);
        const actualOptions: request.CoreOptions = clientGetStub.args[0][1];
        const actualHeaders = actualOptions.headers;
        if (actualHeaders == null) {
          expect(actualHeaders).to.not.be.undefined;
        } else {
          expect(actualHeaders['X-Channel-Ape-Authorization-Token']).to.equal(expectedSessionId);
        }

        const actualChannelApeErrorResponse = e as ChannelApeErrorResponse;
        expect(actualChannelApeErrorResponse.statusCode).to.equal(401);
        expect(actualChannelApeErrorResponse.errors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.errors[0].message)
          .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      });
    });

  });
});
