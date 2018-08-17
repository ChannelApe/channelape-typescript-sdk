import OrdersService from './../../../src/orders/service/OrdersService';
import * as sinon from 'sinon';
import Order from '../../../src/orders/model/Order';
import { expect } from 'chai';
import axios from 'axios';
import LogLevel from '../../../src/model/LogLevel';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import ChannelApeError from '../../../src/model/ChannelApeError';
import OrdersQueryRequestByBusinessId from '../../../src/orders/model/OrdersQueryRequestByBusinessId';
import OrdersQueryRequestByChannelOrderId from '../../../src/orders/model/OrdersQueryRequestByChannelOrderId';
import FulfillmentStatus from '../../../src/orders/model/FulfillmentStatus';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import Resource from '../../../src/model/Resource';
import Version from '../../../src/model/Version';

import singleOrder from '../resources/singleOrder';
import singleCanceledOrder from '../resources/singleCanceledOrder';
import singleOrderWithOneLineItemAndOneFulfillment from '../resources/singleOrderWithOneLineItemAndOneFulfillment';
import singleClosedOrderWithFulfillments from '../resources/singleClosedOrderWithFulfillments';
import singleOrderToUpdate from '../resources/singleOrderToUpdate';
import singleOrderToUpdateResponse from '../resources/singleOrderToUpdateResponse';
import multipleOrders from '../resources/multipleOrders';

const maximumRequestRetryTimeout = 3000;

describe('OrdersService', () => {

  describe('Given some valid rest client', () => {
    const clientWrapper: RequestClientWrapper = new RequestClientWrapper(
      60000, 'valid-session-id', LogLevel.INFO, Environment.STAGING, maximumRequestRetryTimeout, 50, 50
    );

    let sandbox: sinon.SinonSandbox;

    const expectedChannelApeErrorResponse : ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 174,
          message: 'Order could not be found.'
        }
      ]
    };

    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it(`And valid orderId
            When retrieving order Then return resolved promise with order`, () => {
      const response = {
        status: 200,
        config: {},
        data: singleOrder
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get').resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.id).to.equal(orderId);
        expect(typeof actualOrder.totalShippingTax).to.equal('undefined');
        expect(typeof actualOrder.canceledAt).to.equal('undefined');
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ORDERS}/${orderId}`);
      });
    });

    it(`And valid orderId for canceled order
          When retrieving order then return resolved promise with order and correct dates`, () => {
      const response = {
        status: 200,
        config: {},
        data: singleCanceledOrder
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get').resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const orderId = '06b70c49-a13e-42ca-a490-404d29c7fa46';
      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.id).to.equal(orderId);
        expect(actualOrder.totalShippingTax).to.equal(2);
        expect(actualOrder.lineItems.length).to.equal(3);
        expect(actualOrder.lineItems[0].price).to.equal(15.99);
        if (typeof actualOrder.canceledAt !== 'undefined') {
          expect(actualOrder.canceledAt.getDate()).to.equal(5);
        } else {
          throw new Error('canceled at should not be undefined');
        }
        if (typeof actualOrder.fulfillments === 'undefined') {
          throw new Error('fulfillments length should be 0');
        }
        expect(actualOrder.fulfillments.length).to.equal(0);
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ORDERS}/${orderId}`);
      });
    });

    it(`And valid orderId for order with one line item and fulfillment
          When retrieving order then return resolved promise with order with line item and one fulfillment`, () => {
      const response = {
        status: 200,
        config: {},
        data: singleOrderWithOneLineItemAndOneFulfillment
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get').resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const orderId = '06b70c49-a13e-42ca-a490-404d29c7fa46';
      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.lineItems.length).to.equal(1);
        if (typeof actualOrder.fulfillments === 'undefined') {
          throw new Error('fulfillments length should be 1');
        }
        expect(actualOrder.fulfillments.length).to.equal(1);

        const fulfillment1 = actualOrder.fulfillments[0];
        if (typeof fulfillment1.trackingUrls === 'undefined') {
          throw new Error('tracking urls for fulfillment 1 length should be 1');
        }
        expect(fulfillment1.trackingUrls.length).to.equal(2);
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url1');
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url2');
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ORDERS}/${orderId}`);
      });
    });

    it(`And valid orderId for closed order with fulfillment
          When retrieving order then return resolved promise with closed order with fulfillment`, () => {
      const response = {
        status: 200,
        config: {},
        data: singleClosedOrderWithFulfillments
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get').resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const orderId = '9dc34b92-70d1-42d8-8b4e-ae7fb3deca70';
      return ordersService.get(orderId).then((actualOrder) => {
        if (typeof actualOrder.fulfillments === 'undefined') {
          throw new Error('fulfillments length should be 0');
        }
        expect(actualOrder.fulfillments.length).to.equal(1);
        expect(actualOrder.fulfillments[0].lineItems.length).to.equal(6);
        expect(actualOrder.fulfillments[0].lineItems[0].price).to.equal(15.91);

        const fulfillment1 = actualOrder.fulfillments[0];
        if (typeof fulfillment1.trackingUrls === 'undefined') {
          throw new Error('tracking urls for fulfillment 1 length should be 1');
        }
        expect(fulfillment1.trackingUrls.length).to.equal(2);
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url1');
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url2');
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ORDERS}/${orderId}`);
      });
    });

    it(`And invalid orderId
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      const response = {
        config: {},
        status: 404,
        statusText: 'Not Found',
        body: {
          errors: [
            {
              code: 174,
              message: 'Order could not be found.'
            }
          ]
        }
      };
      sandbox.stub(axios, 'get')
          .yields(null, response, expectedChannelApeErrorResponse);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const orderId = 'not-a-real-order-id';
      return ordersService.get(orderId).then((actualOrder) => {
        throw new Error('Test failed!');
      })
      .catch((e: ChannelApeError) => {
        expect(e.message).to.be.an('string');
      });
    });

    it(`And valid businessId and channelOrderId
            When retrieving order Then return resolved promise with order`, () => {
      const response = {
        status: 200,
        config: {},
        data: {
          orders: [singleOrder],
          pagination: {
            lastPage: true
          }
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get').resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const channelOrderId = '314980073478';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersQueryRequestByChannelOrderId = {
        businessId,
        channelOrderId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(1);
        expect(actualOrders[0].channelOrderId).to.equal(channelOrderId);
        expect(actualOrders[0].businessId).to.equal(businessId);
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}/orders`);
      });
    });

    it(`And valid businessId, start date, and end date
            When retrieving orders Then return resolved promise with orders`, () => {

      const response = {
        status: 200,
        config: {},
        data: {
          orders: multipleOrders,
          pagination: {
            lastPage: true
          }
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get').resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId,
        startDate: new Date('2018-05-01T18:07:58.009Z'),
        endDate: new Date('2018-05-07T18:07:58.009Z')
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(2);
        expect(actualOrders[0].businessId).to.equal(businessId);
        expect(clientGetStub.args[0][1].params.startDate).to.equal('2018-05-01T18:07:58.009Z');
        expect(clientGetStub.args[0][1].params.endDate).to.equal('2018-05-07T18:07:58.009Z');
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}/orders`);
      });
    });

    it(`And valid businessId with multiple pages of orders
            When retrieving orders Then return resolved promise with all orders`, () => {

      const response1 = {
        status: 200,
        config: {},
        data: {
          orders: multipleOrders,
          pagination: {
            lastPage: false
          }
        }
      };
      const response2 = {
        status: 200,
        config: {},
        data: {
          orders: multipleOrders,
          pagination: {
            lastPage: true
          }
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
      clientGetStub.onFirstCall().resolves(response1);
      clientGetStub.onSecondCall().resolves(response2);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(4);
        expect(actualOrders[0].businessId).to.equal(businessId);
        expect(typeof clientGetStub.args[0][1].params.startDate).to.equal('undefined');
        expect(typeof clientGetStub.args[0][1].params.endDate).to.equal('undefined');
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}/orders`);
      });
    });

    it(`And valid businessId with multiple pages of orders
        and the singlePage option set to true
            When retrieving orders
            Then return resolved promise with a single page of orders`, () => {

      const response = {
        status: 200,
        config: {},
        data: {
          orders: multipleOrders,
          pagination: {
            lastPage: false
          }
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
      clientGetStub.onFirstCall().resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const expectedBusinessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: (OrdersQueryRequestByBusinessId) = {
        businessId: 'something'
      };
      return ordersService.getPage(requestOptions).then((actualOrdersResponse) => {
        expect(actualOrdersResponse.orders.length).to.equal(2);
        expect(actualOrdersResponse.orders[0].businessId).to.equal(expectedBusinessId);
        expect(typeof clientGetStub.args[0][1].params.startDate).to.equal('undefined');
        expect(typeof clientGetStub.args[0][1].params.endDate).to.equal('undefined');
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}/orders`);
        expect(clientGetStub.calledOnce).to.be.true;
        expect(actualOrdersResponse.pagination.lastPage).to.be.false;
      });
    });

    it(`And invalid businessId
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      const response = {
        status: 404,
        config: {},
        data: {
          statusCode: 404,
          errors:[
            {
              code: 15,
              message: 'Requested business cannot be found.'
            }
          ]
        }
      };
      // tslint:disable:no-trailing-whitespace
      const expectedErrorMessage =
` /v1/orders
  Status: 404
  Response Body:
  404 undefined
Code: 15 Message: Requested business cannot be found.`;
      // tslint:enable:no-trailing-whitespace
      sandbox.stub(axios, 'get').resolves(response);

      const ordersService: OrdersService = new OrdersService(clientWrapper);
      const businessId = 'not-a-real-business-id';
      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        throw new Error('Test failed!');
      })
      .catch((e: ChannelApeError) => {
        expect(e.message).to.equal(expectedErrorMessage);
      });
    });

    it(`And valid order when updating said order
          Then return updated order`, () => {
      const order: Order = singleOrderToUpdate;
      order.id = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      if (typeof order.fulfillments === 'undefined') {
        throw new Error('fulfillments length should be 0');
      }
      order.fulfillments.push({
        additionalFields: [
          {
            name: 'some-addtl-field',
            value: 'some-value'
          }
        ],
        id: 'fulfillment-id',
        lineItems: order.lineItems,
        status: FulfillmentStatus.OPEN
      });
      const response = {
        status: 202,
        config: {},
        data: singleOrderToUpdateResponse
      };
      const clientPutStub: sinon.SinonStub = sandbox.stub(axios, 'put').resolves(response);
      const ordersService: OrdersService = new OrdersService(clientWrapper);
      return ordersService.update(order).then((actualOrder) => {
        expect(actualOrder.id).to.equal(order.id);
        if (typeof actualOrder.fulfillments === 'undefined') {
          throw new Error('fulfillments length should be 0');
        }
        expect(actualOrder.fulfillments.length).to.equal(1);
        expect(actualOrder.fulfillments[0].lineItems.length).to.equal(2);
        expect(actualOrder.fulfillments[0].lineItems[0].sku).to.equal('b4809155-1c5d-4b3b-affc-491ad5503007');
        expect(clientPutStub.args[0][0]).to.equal(`${Version.V1}${Resource.ORDERS}/${order.id}`);
      });
    });
  });

  describe('Given some invalid rest client', () => {
    const client: RequestClientWrapper = new RequestClientWrapper(
        60000, 'valid-session-id', LogLevel.INFO, 'this-is-not-a-real-base-url', maximumRequestRetryTimeout, 50, 50
      );

    it(`And invalid orderId
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      // tslint:disable:no-trailing-whitespace
      const expectedErrorMessage =
`get /v1/orders/not-a-real-order-id
  Status: 401 
  Response Body:
  Request failed with status code 401
Code: 12 Message: Invalid authorization token. Please check the server logs and try again.`;
      // tslint:enable:no-trailing-whitespace
      const ordersService: OrdersService = new OrdersService(client);
      const orderId = 'not-a-real-order-id';
      return ordersService.get(orderId).then((actualOrder) => {
        throw new Error('Test failed!');
      })
      .catch((e) => {
        expect(e.message).to.equal(expectedErrorMessage);
      });
    });

    it(`And invalid businessId
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      // tslint:disable:no-trailing-whitespace
      const expectedErrorMessage =
`get /v1/orders
  Status: 401 
  Response Body:
  Request failed with status code 401
Code: 12 Message: Invalid authorization token. Please check the server logs and try again.`;
      // tslint:enable:no-trailing-whitespace
      const ordersService: OrdersService = new OrdersService(client);
      const businessId = 'not-a-real-business-id';
      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        throw new Error('Test failed!');
      })
      .catch((e) => {
        expect(e.message).to.equal(expectedErrorMessage);
      });
    });
  });
});
