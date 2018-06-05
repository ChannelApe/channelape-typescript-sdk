import { expect } from 'chai';
import * as sinon from 'sinon';
import ChannelApeClient from '../src/ChannelApeClient';
import ActionsService from '../src/actions/service/ActionsService';
import ActionProcessingStatus from '../src/actions/model/ActionProcessingStatus';
import ChannelsService from '../src/channels/service/ChannelsService';
import request = require('request');
import ChannelApeApiErrorResponse from '../src/model/ChannelApeApiErrorResponse';
import { LogLevel } from 'channelape-logger';
import Action from '../src/actions/model/Action';
import Order from '../src/orders/model/Order';
import Environment from '../src/model/Environment';
import OrdersService from '../src/orders/service/OrdersService';

import singleOrder from '../test/orders/resources/singleOrder';

let requestSpy: sinon.SinonSpy;

describe('ChannelApe Client', () => {

  let sandbox: sinon.SinonSandbox;
  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    requestSpy = sandbox.spy(request, 'defaults');
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe(`Given client configuration with valid session ID, 2000 millisecond timeout,
             Staging endpoint, and logLevel of VERBOSE`, () => {
    const expectedSessionId = 'c478c897-dc1c-4171-a207-9e3af9b23579';
    const channelApeClient = new ChannelApeClient({
      sessionId: expectedSessionId,
      timeout: 2000,
      endpoint: Environment.STAGING
    });

    context('When retrieving LogLevel', () => {
      it('Then expect LogLevel of "VERBOSE"', () => {
        const channelApeClient = new ChannelApeClient({
          sessionId: 'c478c897-dc1c-4171-a207-9e3af9b23579',
          logLevel: LogLevel.VERBOSE
        });
        expect(channelApeClient.LogLevel).to.equal(LogLevel.VERBOSE);
        expect(channelApeClient.LogLevel).to.equal('verbose');
        expectRequestDefaults(requestSpy);
      });
    });

    context('When retrieving sessionId', () => {
      it('Then expect given sessionId', () => {
        expect(channelApeClient.SessionId).to.equal(expectedSessionId);
      });
    });

    context('When retrieving timeout', () => {
      it('Then expect timeout of 2000 milliseconds', () => {
        expect(channelApeClient.Timeout).to.equal(2000);
      });
    });

    context('When retrieving endpoint', () => {
      it('Then expect staging endpoint of staging-api.channelape.com', () => {
        expect(channelApeClient.Endpoint).to.equal(Environment.STAGING);
      });
    });
  });

  describe('Given client configuration with valid session ID ' +
  'And -5 minute timeout And 1999 maximumRequestRetryTimeout And Staging endpoint', () => {
    const expectedSessionId = 'c478c897-dc1c-4171-a207-9e3af9b23579';
    const channelApeClient = new ChannelApeClient({
      sessionId: expectedSessionId,
      timeout: -300000,
      maximumRequestRetryTimeout: 1999,
      endpoint: Environment.STAGING
    });

    context('When retrieving timeout', () => {
      it('Then expect default timeout of 3 minutes in milliseconds', () => {
        expect(channelApeClient.Timeout).to.equal(180000);
      });
      it('And expect default maximumRequestRetryTimeout of 3 minutes in milliseconds', () => {
        expect(channelApeClient.MaximumRequestRetryTimeout).to.equal(180000);
      });
    });
  });

  describe('Given client configuration with valid session ID And 1999 millisecond timeout And Staging endpoint', () => {
    const expectedSessionId = 'c478c897-dc1c-4171-a207-9e3af9b23579';
    const channelApeClient = new ChannelApeClient({
      sessionId: expectedSessionId,
      timeout: 1999,
      endpoint: Environment.STAGING
    });

    context('When retrieving maximumRequestRetryTimeout', () => {
      it('Then expect default maximumRequestRetryTimeout of 3 minutes in milliseconds', () => {
        expect(channelApeClient.Timeout).to.equal(180000);
      });
      it('And expect default maximumRequestRetryTimeout of 3 minutes in milliseconds', () => {
        expect(channelApeClient.MaximumRequestRetryTimeout).to.equal(180000);
      });
    });
  });

  describe('Given client configuration with 2000 ms maximumRequestRetryTimeout', () => {
    const expectedSessionId = 'c478c897-dc1c-4171-a207-9e3af9b23579';
    const channelApeClient = new ChannelApeClient({
      sessionId: expectedSessionId,
      timeout: 1999,
      endpoint: Environment.STAGING,
      maximumRequestRetryTimeout: 2000
    });

    context('When retrieving maximumRequestRetryTimeout', () => {
      it('Then expect maximumRequestRetryTimeout of 2000 ms', () => {
        expect(channelApeClient.MaximumRequestRetryTimeout).to.equal(2000);
      });
    });
  });

  describe('Given client configuration with valid session ID', () => {
    const channelApeClient = new ChannelApeClient({
      sessionId: 'c478c897-dc1c-4171-a207-9e3af9b23579'
    });

    context('When retrieving timeout', () => {
      it('Then expect default timeout of 3 minutes in milliseconds', () => {
        expect(channelApeClient.Timeout).to.equal(180000);
      });
    });

    context('When retrieving endpoint', () => {
      it('Then expect default endpoint of api.channelape.com', () => {
        expect(channelApeClient.Endpoint).to.equal(Environment.PRODUCTION);
      });
    });

    it('When retrieving valid action Then return resolved promise with action data', () => {
      const expectedAction: Action = {
        action: 'PRODUCT_PULL',
        businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
        description: 'Encountered error during product pull for Europa Sports',
        healthCheckIntervalInSeconds: 300,
        id: 'a85d7463-a2f2-46ae-95a1-549e70ecb2ca',
        lastHealthCheckTime: new Date('2018-04-24T14:02:34.703Z'),
        processingStatus: ActionProcessingStatus.ERROR,
        startTime: new Date('2018-04-24T14:02:34.703Z'),
        targetId: '1e4ebaa6-9796-4ccf-bd73-8765893a66bd',
        targetType: 'supplier'
      };

      sandbox.stub(ActionsService.prototype, 'get')
        .callsFake((expectedActionId) => {
          return Promise.resolve(expectedAction);
        });

      return channelApeClient.actions().get(expectedAction.id).then((actualAction) => {
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

    it('When retrieving invalid channel Then return resolved promise with channel data', () => {
      const channelId = 'c0eb01a0-bcd5-4dba-98fb-fd7f7993ecb2';
      const expectedChannelApeErrorResponse : ChannelApeApiErrorResponse = {
        statusCode: 404,
        errors: [
          {
            code: 70,
            message: 'Channel could not be found for business.'
          }
        ]
      };

      sandbox.stub(ChannelsService.prototype, 'get')
        .callsFake((channelId) => {
          return Promise.reject(expectedChannelApeErrorResponse);
        });

      return channelApeClient.channels().get(channelId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((error) => {
        const actualChannelApeErrorResponse = error as ChannelApeApiErrorResponse;
        expect(actualChannelApeErrorResponse.statusCode).to.equal(404);
        expect(actualChannelApeErrorResponse.errors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(actualChannelApeErrorResponse.errors[0].message)
          .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      });
    });

    it('When retrieving order by valid orderId', () => {
      const expectedOrder: Order = singleOrder;
      const expectedOrderId = expectedOrder.id;

      sandbox.stub(OrdersService.prototype, 'get')
        .callsFake((expectedOrderId) => {
          return Promise.resolve(expectedOrder);
        });

      return channelApeClient.orders().get(expectedOrder.id).then((actualOrder) => {
        expect(actualOrder.id).to.equal(expectedOrderId);
      });
    });
  });

  describe('Given client configuration with empty session ID', () => {
    const clientConfiguration = {
      sessionId: ''
    };
    context('When creating client', () => {
      it('Then throw Error with invalid configuration message', () => {
        expect(() => {
          new ChannelApeClient(clientConfiguration);
        }).to.throw('Invalid configuration. sessionId is required.');
      });
    });
  });

});

function expectRequestDefaults(requestSpy: sinon.SinonSpy) {
  expect(requestSpy.args[0][0].headers['X-Channel-Ape-Authorization-Token'])
    .to.equal('c478c897-dc1c-4171-a207-9e3af9b23579');
  expect(requestSpy.args[0][0].json).to.equal(true);
}
