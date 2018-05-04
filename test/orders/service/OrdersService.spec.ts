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
import multipleOrders from '../resources/multipleOrders';

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

    it(`And valid businessId 
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
        businessId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(2);
        expect(actualOrders[0].businessId).to.equal(businessId);
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
