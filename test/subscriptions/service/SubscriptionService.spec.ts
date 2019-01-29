import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import axios from 'axios';

import SubscriptionsService from './../../../src/subscriptions/service/SubscriptionsService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import RequestClientWrapper from '../../../src/RequestClientWrapper';

const endpoint = 'https://fake-api.test.com';

describe('Subscriptions Service', () => {

  describe('Given some rest client and session ID ', () => {
    const client: RequestClientWrapper =
      new RequestClientWrapper({
        endpoint,
        maximumRequestRetryTimeout: 10000,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: 50,
        maximumRequestRetryRandomDelay: 50
      });
    const active = true;
    const businessId = 'f6ed6f7a-47bf-4dd3-baed-71a8a9684e80';
    const createdAt = '2018-02-22T16:03:42.662Z';
    const errors: any = [];
    const lastCompletedTaskUsageRecordingTime = '2018-04-02T00:00:00.000Z';
    const periodEndsAt = '2019-02-08T16:03:11.000Z';
    const periodStartedAt = '2019-01-08T16:03:11.000Z';
    const subscriptionId = '1701701';
    const subscriptionProductHandle = 'fake-handle';
    const updatedAt = '2019-01-08T16:20:45.865Z';
    const subscriptionsService = new SubscriptionsService(client);

    let sandbox: sinon.SinonSandbox;

    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('And subscription ID is valid ' +
      'When retrieving subscription Then return resolved promise with subscription data', () => {

      const expectedResponse = {
        active,
        businessId,
        createdAt,
        errors,
        lastCompletedTaskUsageRecordingTime,
        periodEndsAt,
        periodStartedAt,
        subscriptionId,
        subscriptionProductHandle,
        updatedAt
      };

      const response = {
        status: 200,
        config: {},
        data: expectedResponse
      };

      const clientGetStub = sandbox.stub(axios, 'get').resolves(response);

      return subscriptionsService.get(businessId).then((actualResponse) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SUBSCRIPTIONS}/${businessId}`);
        expect(actualResponse.active).to.equal(active);
        expect(actualResponse.businessId).to.equal(businessId);
        expect(actualResponse.createdAt!.toISOString()).to.equal(createdAt);
        expect(actualResponse.errors.length).to.equal(0);
        expect(actualResponse.lastCompletedTaskUsageRecordingTime!.toISOString())
          .to.equal(lastCompletedTaskUsageRecordingTime);
        expect(actualResponse.periodEndsAt!.toISOString()).to.equal(periodEndsAt);
        expect(actualResponse.periodStartedAt!.toISOString()).to.equal(periodStartedAt);
        expect(actualResponse.subscriptionId).to.equal(subscriptionId);
        expect(actualResponse.subscriptionProductHandle).to.equal(subscriptionProductHandle);
        expect(actualResponse.updatedAt!.toISOString()).to.equal(updatedAt);
      });
    });

    it('And subscription ID is valid ' +
      'When retrieving subscription Then return resolved promise with subscription data', () => {

      const expectedResponse = {
        errors
      };

      const response = {
        status: 200,
        config: {},
        data: expectedResponse
      };

      const clientGetStub = sandbox.stub(axios, 'get').resolves(response);

      return subscriptionsService.get(businessId).then((actualResponse) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SUBSCRIPTIONS}/${businessId}`);
        expect(actualResponse.active).to.equal(undefined);
        expect(actualResponse.businessId).to.equal(undefined);
        expect(actualResponse.createdAt).to.equal(undefined);
        expect(actualResponse.errors.length).to.equal(0);
        expect(actualResponse.lastCompletedTaskUsageRecordingTime)
          .to.equal(undefined);
        expect(actualResponse.periodEndsAt).to.equal(undefined);
        expect(actualResponse.periodStartedAt).to.equal(undefined);
        expect(actualResponse.subscriptionId).to.equal(undefined);
        expect(actualResponse.subscriptionProductHandle).to.equal(undefined);
        expect(actualResponse.updatedAt).to.equal(undefined);
      });
    });

    it('And subscription ID is valid And request connect errors ' +
      'When retrieving subscription Then return a rejected promise with an error', (done) => {

      const expectedError = {
        stack: 'oh no an error'
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      subscriptionsService.get(businessId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0])
            .to.equal(`/${Version.V1}${Resource.SUBSCRIPTIONS}/${businessId}`);
        expect(e).to.be.equal(expectedError);
        done();
      });
    });

    it('And business ID is invalid ' +
      'When retrieving subscription Then return rejected promise with 401 ' +
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

      return subscriptionsService.get(businessId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((actualChannelApeErrorResponse) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.SUBSCRIPTIONS}/${businessId}`);
        expect(actualChannelApeErrorResponse.responseStatusCode).to.equal(401);
        expect(actualChannelApeErrorResponse.ApiErrors.length).to.equal(1);
        expect(actualChannelApeErrorResponse.ApiErrors[0].code)
          .to.equal(expectedChannelApeApiErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.ApiErrors[0].message)
          .to.equal(expectedChannelApeApiErrorResponse.errors[0].message);
      });
    });

    it('And subscriptions endpoint returns a 202 erroneously ' +
      'When retrieving subscription Then return rejected promise with 202 ' +
      'status code and error message', () => {

      const expectedChannelApeApiErrorResponse : ChannelApeApiErrorResponse = {
        statusCode: 202,
        errors: []
      };
      const response = {
        status: 202,
        config: {},
        data: expectedChannelApeApiErrorResponse
      };
      const clientGetStub = sandbox.stub(axios, 'get').resolves(response);

      return subscriptionsService.get(businessId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((actualChannelApeErrorResponse) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.SUBSCRIPTIONS}/${businessId}`);
        expect(actualChannelApeErrorResponse.statusCode).to.equal(202);
      });
    });
  });
});
