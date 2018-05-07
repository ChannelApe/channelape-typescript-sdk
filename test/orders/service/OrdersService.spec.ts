import OrdersService from './../../../src/orders/service/OrdersService';
import * as sinon from 'sinon';
import Order from '../../../src/orders/model/Order';
import { expect } from 'chai';
import request = require('request');
import Environment from '../../../src/model/Environment';
import ChannelApeErrorResponse from '../../../src/model/ChannelApeErrorResponse';
import OrdersRequest from '../../../src/orders/model/OrdersRequest';
import OrdersRequestByBusinessId from '../../../src/orders/model/OrdersRequestByBusinessId';
import OrdersRequestByChannel from '../../../src/orders/model/OrdersRequestByChannel';
import OrdersRequestByChannelOrderId from '../../../src/orders/model/OrdersRequestByChannelOrderId';

import singleOrder from '../resources/singleOrder';
import singleCancelledOrder from '../resources/singleCancelledOrder';
import singleOrderWithNoLineItems from '../resources/singleOrderWithNoLineItems';
import singleClosedOrderWithFulfillments from '../resources/singleClosedOrderWithFulfillments';
import singleOrderToUpdate from '../resources/singleOrderToUpdate';
import singleOrderToUpdateResponse from '../resources/singleOrderToUpdateResponse';
import multipleOrders from '../resources/multipleOrders';
import FulfillmentStatus from '../../../src/orders/model/FulfillmentStatus';

describe('OrdersService', () => {

  describe('Given some rest client', () => {
    const client = request.defaults({
      baseUrl: Environment.STAGING,
      timeout: 60000,
      json: true,
      headers: {
        'X-Channel-Ape-Authorization-Token': 'valid-session-id'
      }
    });

    let sandbox: sinon.SinonSandbox;

    const expectedChannelApeErrorResponse : ChannelApeErrorResponse = {
      statusCode: 404,
      errors: [
        { 
          code: 174, 
          message: 'Order could not be found.' 
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

    it(`And valid orderId 
            When retrieving order Then return resolved promise with order`, () => {
      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, singleOrder);

      const ordersService: OrdersService = new OrdersService(client);
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.id).to.equal(orderId);
        expect(typeof actualOrder.totalShippingTax).to.equal('undefined');
        expect(typeof actualOrder.canceledAt).to.equal('undefined');
      });
    });

    it(`And valid orderId for cancelled order
          When retrieving order then return resolved promise with order and correct dates`, () => {
      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, singleCancelledOrder);

      const ordersService: OrdersService = new OrdersService(client);
      const orderId = '06b70c49-a13e-42ca-a490-404d29c7fa46';
      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.id).to.equal(orderId);
        expect(actualOrder.totalShippingTax).to.equal(2);
        expect(actualOrder.lineItems.length).to.equal(3);
        expect(actualOrder.lineItems[0].price).to.equal(15.99);
        if (typeof actualOrder.canceledAt !== 'undefined') {
          expect(actualOrder.canceledAt.getDate()).to.equal(5);
        }
        expect(actualOrder.fulfillments.length).to.equal(0);
      });
    });

    it(`And valid orderId for order with no line items or fulfillments
          When retrieving order then return resolved promise with order and no line items or fulfillments`, () => {
      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, singleOrderWithNoLineItems);

      const ordersService: OrdersService = new OrdersService(client);
      const orderId = '06b70c49-a13e-42ca-a490-404d29c7fa46';
      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.lineItems.length).to.equal(0);
        expect(actualOrder.fulfillments.length).to.equal(0);
      });
    });

    it(`And valid orderId for closed order with fulfillment
          When retrieving order then return resolved promise with closed order with fulfillment`, () => {
      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, singleClosedOrderWithFulfillments);

      const ordersService: OrdersService = new OrdersService(client);
      const orderId = '9dc34b92-70d1-42d8-8b4e-ae7fb3deca70';
      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.fulfillments.length).to.equal(1);
        expect(actualOrder.fulfillments[0].lineItems.length).to.equal(6);
        expect(actualOrder.fulfillments[0].lineItems[0].price).to.equal(15.91);
      });
    });

    it(`And invalid orderId 
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      const response = {
        statusCode: 404
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedChannelApeErrorResponse);

      const ordersService: OrdersService = new OrdersService(client);
      const orderId = 'not-a-real-order-id';
      return ordersService.get(orderId).then((actualOrder) => {
        throw new Error('Test failed!');
      })
      .catch((e: ChannelApeErrorResponse) => {
        expect(e.errors).to.be.an('array');
      });
    });

    it(`And valid businessId and channelOrderId 
            When retrieving order Then return resolved promise with order`, () => {
      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, {
            orders: [singleOrder],
            pagination: {
              lastPage: true
            }
          });

      const ordersService: OrdersService = new OrdersService(client);
      const channelOrderId = '314980073478';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersRequestByChannelOrderId = {
        businessId,
        channelOrderId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(1);
        expect(actualOrders[0].channelOrderId).to.equal(channelOrderId);
        expect(actualOrders[0].businessId).to.equal(businessId);
      });
    });

    it(`And valid businessId, start date, and end date
            When retrieving orders Then return resolved promise with orders`, () => {

      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, { 
            orders: multipleOrders,
            pagination: {
              lastPage: true
            }
          });

      const ordersService: OrdersService = new OrdersService(client);
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersRequestByBusinessId = {
        businessId,
        startDate: new Date('2018-05-01T18:07:58.009Z'),
        endDate: new Date('2018-05-07T18:07:58.009Z')
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(2);
        expect(actualOrders[0].businessId).to.equal(businessId);
        expect(clientGetStub.args[0][1].qs.startDate).to.equal('2018-05-01T18:07:58.009Z');
        expect(clientGetStub.args[0][1].qs.endDate).to.equal('2018-05-07T18:07:58.009Z');
      });
    });

    it(`And valid businessId with multiple pages of orders
            When retrieving orders Then return resolved promise with all orders`, () => {

      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get');
      clientGetStub.onFirstCall()
        .yields(null, response, { 
          orders: multipleOrders,
          pagination: {
            lastPage: false
          }
        });
      clientGetStub.onSecondCall()
        .yields(null, response, { 
          orders: multipleOrders,
          pagination: {
            lastPage: true
          }
        });

      const ordersService: OrdersService = new OrdersService(client);
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersRequestByBusinessId = {
        businessId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(4);
        expect(actualOrders[0].businessId).to.equal(businessId);
        expect(typeof clientGetStub.args[0][1].qs.startDate).to.equal('undefined');
        expect(typeof clientGetStub.args[0][1].qs.endDate).to.equal('undefined');
      });
    });

    it(`And invalid businessId 
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      const response = {
        statusCode: 404
      };
      const expectedChannelApeBusinessNotFoundError: ChannelApeErrorResponse = {
        statusCode: 404,
        errors:[
          {
            code: 15,
            message: 'Requested business cannot be found.'
          }
        ]
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedChannelApeBusinessNotFoundError);

      const ordersService: OrdersService = new OrdersService(client);
      const businessId = 'not-a-real-business-id';
      const requestOptions: OrdersRequestByBusinessId = {
        businessId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        throw new Error('Test failed!');
      })
      .catch((e: ChannelApeErrorResponse) => {
        expect(e.errors).to.be.an('array');
      });
    });

    it(`And valid order when updating said order
          Then return updated order`, () => {
      const order: Order = singleOrderToUpdate;
      order.id = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
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
        statusCode: 202
      };
      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, singleOrderToUpdateResponse);
      const ordersService: OrdersService = new OrdersService(client);
      return ordersService.update(order).then((actualOrder) => {
        expect(actualOrder.id).to.equal(order.id);
        expect(actualOrder.fulfillments.length).to.equal(1);
        expect(actualOrder.fulfillments[0].lineItems.length).to.equal(2);
        expect(actualOrder.fulfillments[0].lineItems[0].sku).to.equal('b4809155-1c5d-4b3b-affc-491ad5503007');
        expect(clientPutStub.args[0][0]).to.equal(`v1/orders/${order.id}`);
      });
    });
  });

  describe('Given some invalid rest client', () => {
    const client = request.defaults({
      baseUrl: 'this-is-not-a-real-base-url',
      timeout: 60000,
      json: true,
      headers: {
        'X-Channel-Ape-Authorization-Token': 'some-session-id'
      }
    });

    it(`And invalid orderId 
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      const expectedErrorMessage = 'Invalid URI "this-is-not-a-real-base-url/v1/orders/not-a-real-order-id"';

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
      const expectedErrorMessage = 'Invalid URI "this-is-not-a-real-base-url/v1/orders"';
      
      const ordersService: OrdersService = new OrdersService(client);
      const businessId = 'not-a-real-business-id';
      const requestOptions: OrdersRequestByBusinessId = {
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
