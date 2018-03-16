import OrderRetrievalService from './../../../src/orders/service/OrderRetrievalService';
import * as sinon from 'sinon';
import { Client } from 'node-rest-client';
import { mockResponse } from './../../helper/mockResponse';
import Order from '../../../src/orders/model/Order';
import { expect } from 'chai';

describe('OrderRetrievalService', () => {

  describe('given some rest client, and some valid api secret, and some valid endpoint ', () => {

    let sandbox;
    const someClient = new Client();
    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('given found order id when retrieving an order then return promise with the order', () => {
      
      const expectedResponse: Order = generateOrder();
      
      const someClientGetStub = sandbox.stub(someClient, 'get').callsFake(mockResponse(expectedResponse, 200));

      const orderRetrievalService = new OrderRetrievalService(someClient, '123', 'api.channelape.com');
      orderRetrievalService.get(1).then((order : Order) => {
        expect(order).to.deep.equal(expectedResponse);
      });

    });

    function generateOrder() {
      return {
        id: '1',
        channelOrderId: '2',
        channelId: '3',
        businessId: '4',
        purchasedAt: '2018-03-14T13:39:31.000Z',
        canceledAt: '2018-03-14T13:39:31.000Z',
        canceledReason:'2018-03-14T13:39:31.000Z',
        updatedAt: '2018-03-14T13:39:31.000Z',
        createdAt: '2018-03-14T13:39:31.000Z',
        status: 'OPEN' ,
        totalPrice: 49.99,
        subtotalPrice: 49.99,
        totalShippingTax: 3.99,
        totalTax: 4.99,
        totalGrams: 35.5789,
        alphabeticCurrencyCode: 'USD',
        lineItems: [],
        fulfillments: []
      };
    }
  });

});
