import OrdersService from '../../../src/orders/service/OrdersService';
import Order from '../../../src/orders/model/Order';
import { expect } from 'chai';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import LogLevel from '../../../src/model/LogLevel';
import Environment from '../../../src/model/Environment';
import ChannelApeError from '../../../src/model/ChannelApeError';
import OrdersQueryRequestByBusinessId from '../../../src/orders/model/OrdersQueryRequestByBusinessId';
import OrdersQueryRequestByChannelOrderId from '../../../src/orders/model/OrdersQueryRequestByChannelOrderId';
import OrdersQueryRequestByPurchaseOrderNumber from '../../../src/orders/model/OrdersQueryRequestByPurchaseOrderNumber';
import OrderCreateRequest from '../../../src/orders/model/OrderCreateRequest';
import OrderUpdateRequest from '../../../src/orders/model/OrderUpdateRequest';
import OrderPatchRequest from '../../../src/orders/model/OrderPatchRequest';
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
import multipleOrdersStatus from '../resources/multipleOrdersStatus';
import singleOrderToPatchResponse from '../resources/singleOrderToPatchResponse';
import singleOrderToPatch from '../resources/singleOrderToPatch';
import { OrderStatus } from '../../../src';

const maximumRequestRetryTimeout = 3000;

const clientWrapper: RequestClientWrapper = new RequestClientWrapper({
  maximumRequestRetryTimeout,
  endpoint: Environment.STAGING,
  timeout: 60000,
  session: 'valid-session-id',
  logLevel: LogLevel.INFO,
  minimumRequestRetryRandomDelay: 50,
  maximumRequestRetryRandomDelay: 50,
  maximumConcurrentConnections: 5
});
const ordersService: OrdersService = new OrdersService(clientWrapper);

describe('OrdersService', () => {
  describe('Given some valid rest client', () => {

    it(`And valid orderId
            When retrieving order Then return resolved promise with order`, () => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}/${orderId}`)
        .reply(200, singleOrder);

      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.id).to.equal(orderId);
        expect(actualOrder.purchaseOrderNumber).to.equal(singleOrder.purchaseOrderNumber);
        expect(typeof actualOrder.totalShippingTax).to.equal('undefined');
        expect(typeof actualOrder.canceledAt).to.equal('undefined');
        // @ts-ignore
        expect(actualOrder.refunds.length).to.equal(1);
        // @ts-ignore
        const expectedRefund = singleOrder.refunds[0];
        // @ts-ignore
        const actualRefund1 = actualOrder.refunds[0];
        expect(actualRefund1.channelRefundId).to.equal(expectedRefund.channelRefundId);
        expect(actualRefund1.supplierRefundId).to.equal(expectedRefund.supplierRefundId);
        expect(2).to.equal(expectedRefund.lineItems.length);
        expect(actualRefund1.lineItems[0].sku).to.equal(expectedRefund.lineItems[0].sku);
        expect(actualRefund1.lineItems[0].upc).to.equal(expectedRefund.lineItems[0].upc);
        expect(actualRefund1.lineItems[0].quantity).to.equal(expectedRefund.lineItems[0].quantity);
        expect(actualRefund1.lineItems[0].id).to.equal(expectedRefund.lineItems[0].id);
        expect(actualRefund1.lineItems[0].price).to.equal(expectedRefund.lineItems[0].price);
        expect(actualRefund1.lineItems[0].restockType).to.equal(expectedRefund.lineItems[0].restockType);
        expect(actualRefund1.lineItems[1].sku).to.equal(expectedRefund.lineItems[1].sku);
        expect(actualRefund1.lineItems[1].upc).to.equal(expectedRefund.lineItems[1].upc);
        expect(actualRefund1.lineItems[1].quantity).to.equal(expectedRefund.lineItems[1].quantity);
        expect(actualRefund1.lineItems[1].id).to.equal(expectedRefund.lineItems[1].id);
        expect(actualRefund1.lineItems[1].price).to.equal(expectedRefund.lineItems[1].price);
        expect(actualRefund1.lineItems[1].restockType).to.equal(expectedRefund.lineItems[1].restockType);
      });
    });

    it(`And valid orderId for canceled order
          When retrieving order then return resolved promise with order and correct dates`, () => {
      const orderId = '06b70c49-a13e-42ca-a490-404d29c7fa46';
      const mockedAxiosAdapter = new axiosMockAdapter(axios);

      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}/${orderId}`)
        .reply(200, singleCanceledOrder);

      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.id).to.equal(orderId);
        expect(actualOrder.purchaseOrderNumber).to.equal(singleCanceledOrder.purchaseOrderNumber);
        expect(actualOrder.totalShippingTax).to.equal(2);
        expect(actualOrder.lineItems.length).to.equal(3);
        expect(actualOrder.lineItems[0].price).to.equal(15.99);
        expect(actualOrder.canceledAt!.getDate()).to.equal(5);
        expect(actualOrder.fulfillments!.length).to.equal(0);
      });
    });

    it(`And valid orderId for order with one line item and fulfillment
          When retrieving order then return resolved promise with order with line item and one fulfillment`, () => {
      const orderId = '06b70c49-a13e-42ca-a490-404d29c7fa46';
      const mockedAxiosAdapter = new axiosMockAdapter(axios);

      mockedAxiosAdapter.onAny()
        .reply(200, singleOrderWithOneLineItemAndOneFulfillment);

      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.purchaseOrderNumber)
          .to.equal(singleOrderWithOneLineItemAndOneFulfillment.purchaseOrderNumber);
        expect(actualOrder.lineItems.length).to.equal(1);
        expect(actualOrder.fulfillments!.length).to.equal(1);
        const fulfillment1 = actualOrder.fulfillments![0];
        expect(fulfillment1.trackingUrls!.length).to.equal(2);
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url1');
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url2');
        expect(fulfillment1.locationId).to.contain('28');
        expect(fulfillment1.shippedAt).to.equal(undefined);
      });
    });

    it(`And valid orderId for closed order with fulfillment
          When retrieving order then return resolved promise with closed order with fulfillment`, () => {
      const orderId = '9dc34b92-70d1-42d8-8b4e-ae7fb3deca70';
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}/${orderId}`)
        .reply(200, singleClosedOrderWithFulfillments);

      return ordersService.get(orderId).then((actualOrder) => {
        expect(actualOrder.purchaseOrderNumber).to.be.undefined;
        expect(actualOrder.fulfillments!.length).to.equal(1);
        expect(actualOrder.fulfillments![0].lineItems.length).to.equal(6);
        expect(actualOrder.fulfillments![0].lineItems[0].price).to.equal(15.91);

        const fulfillment1 = actualOrder.fulfillments![0];
        expect(fulfillment1.trackingUrls!.length).to.equal(2);
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url1');
        expect(fulfillment1.trackingUrls).to.contain('https://ups1.com/tracking-url2');
        expect(fulfillment1.locationId).to.contain('28');
        expect(fulfillment1.shippedAt!.toISOString()).to.equal('2018-05-05T17:03:03.582Z');
      });
    });

    it(`And invalid orderId
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet().reply(404, {
        errors: [
          {
            code: 174,
            message: 'Order could not be found.'
          }
        ]
      });

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
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}/orders`).reply(200, {
        orders: [singleOrder],
        pagination: {
          lastPage: true
        }
      });

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
      });
    });

    it(`And valid businessId and purchaseOrderNumber
            When retrieving order Then return resolved promise with order`, () => {
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}/orders`).reply(200, {
        orders: [singleOrder],
        pagination: {
          lastPage: true
        }
      });

      const purchaseOrderNumber = '123456';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersQueryRequestByPurchaseOrderNumber = {
        businessId,
        purchaseOrderNumber
      };
      return ordersService.get(requestOptions).then((actualOrders: Order[]) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(1);
        expect(actualOrders[0].purchaseOrderNumber).to.equal(purchaseOrderNumber);
        expect(actualOrders[0].businessId).to.equal(businessId);
      });
    });

    it(`And valid businessId, start date, end date, updatedAt start date, and updatedAt end date
            When retrieving orders Then return resolved promise with orders`, () => {
      const startDate = '2018-05-01T18:07:58.009Z';
      const updatedAtStartDate = '2018-05-01T18:08:58.009Z';
      const updatedAtEndDate = '2018-05-01T18:08:59.009Z';

      const endDate = '2018-05-07T18:07:58.009Z';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(
        `${Environment.STAGING}/${Version.V1}/orders`,
        {
          params: {
            startDate,
            endDate,
            updatedAtStartDate,
            updatedAtEndDate,
            businessId
          }
        }
      ).reply(200, {
        orders: multipleOrders,
        pagination: {
          lastPage: true
        }
      });

      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        updatedAtStartDate: new Date(updatedAtStartDate),
        updatedAtEndDate: new Date(updatedAtEndDate)
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(2);
        expect(actualOrders[0].businessId).to.equal(businessId);
      });
    });

    it(`And valid businessId, updatedAt start date, and updatedAt end date
            When retrieving orders Then return resolved promise with orders`, () => {
      const updatedAtStartDate = '2018-05-01T18:08:58.009Z';
      const updatedAtEndDate = '2018-05-01T18:08:59.009Z';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(
        `${Environment.STAGING}/${Version.V1}/orders`,
        {
          params: {
            updatedAtStartDate,
            updatedAtEndDate,
            businessId
          }
        }
      ).reply(200, {
        orders: multipleOrders,
        pagination: {
          lastPage: true
        }
      });

      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId,
        updatedAtStartDate: new Date(updatedAtStartDate),
        updatedAtEndDate: new Date(updatedAtEndDate)
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(2);
        expect(actualOrders[0].businessId).to.equal(businessId);
      });
    });

    it(`And valid businessId, updatedAt start date before start date and updatedAt end date,
            When retrieving orders Then return rejected promise with ChannelApeError`, () => {
      const endDate = '2018-04-30T14:08:58.009Z';
      const updatedAtStartDate = '2018-05-01T18:08:58.009Z';
      const updatedAtEndDate = '2018-05-01T18:08:59.009Z';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';

      const expectedErrorMessage =
        `get /v1/orders
  Status: 404
  Response Body:
  Request failed with status code 404`;

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet().reply(404, {
        statusCode: 404
      });

      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId,
        startDate: new Date(endDate),
        updatedAtStartDate: new Date(updatedAtStartDate),
        updatedAtEndDate: new Date(updatedAtEndDate)
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        throw new Error('Test failed!');
      })
        .catch((e: ChannelApeError) => {
          expect(e.message).to.equal(expectedErrorMessage);
        });
    });

    it(`And valid businessId and single status
            When retrieving orders Then return resolved promise with orders`, () => {
      const status = OrderStatus.OPEN;
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(
        `${Environment.STAGING}/${Version.V1}/orders`,
        {
          params: {
            status,
            businessId
          }
        }
      ).reply(200, {
        orders: multipleOrdersStatus.filter(order => order.status === status),
        pagination: {
          lastPage: true
        }
      });

      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId,
        status
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(1);
        expect(actualOrders[0].businessId).to.equal(businessId);
      });
    });

    it(`And valid businessId and multiple statuses
            When retrieving orders Then return resolved promise with orders`, () => {
      const status: OrderStatus[] = [OrderStatus.CLOSED, OrderStatus.OPEN];
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(
        `${Environment.STAGING}/${Version.V1}/orders`,
        {
          params: {
            status,
            businessId
          }
        }
      ).reply(200, {
        orders: multipleOrdersStatus.filter(order => status.indexOf(order.status) > -1),
        pagination: {
          lastPage: true
        }
      });

      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId,
        status
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(2);
        expect(actualOrders[0].businessId).to.equal(businessId);
      });
    });

    it(`And valid businessId with multiple pages of orders
            When retrieving orders Then return resolved promise with all orders`, () => {

      const responses = [{
        status: 200,
        config: {},
        data: {
          orders: multipleOrders,
          pagination: {
            lastPage: false
          }
        }
      }, {
        status: 200,
        config: {},
        data: {
          orders: multipleOrders,
          pagination: {
            lastPage: true
          }
        }
      }];
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}/orders`).reply(() => {
        const response = responses.shift();
        return Promise.resolve([response!.status, response!.data]);
      });

      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: OrdersQueryRequestByBusinessId = {
        businessId
      };
      return ordersService.get(requestOptions).then((actualOrders) => {
        expect(actualOrders).to.be.an('array');
        expect(actualOrders.length).to.equal(4);
        expect(actualOrders[0].businessId).to.equal(businessId);
      });
    });

    it(`And valid businessId with multiple pages of orders
        and the singlePage option set to true
            When retrieving orders
            Then return resolved promise with a single page of orders`, () => {
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}/orders`).reply(200, {
        orders: multipleOrders,
        pagination: {
          lastPage: false
        }
      });

      const expectedBusinessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestOptions: (OrdersQueryRequestByBusinessId) = {
        businessId: 'something'
      };
      return ordersService.getPage(requestOptions).then((actualOrdersResponse) => {
        expect(actualOrdersResponse.orders.length).to.equal(2);
        expect(actualOrdersResponse.orders[0].businessId).to.equal(expectedBusinessId);
        expect(actualOrdersResponse.pagination.lastPage).to.be.false;
      });
    });

    it(`And invalid businessId
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      // tslint:disable:no-trailing-whitespace
      const expectedErrorMessage =
        `get /v1/orders
  Status: 404
  Response Body:
  Request failed with status code 404
Code: 15 Message: Requested business cannot be found.`;
      // tslint:enable:no-trailing-whitespace
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet().reply(404, {
        statusCode: 404,
        errors: [{ code: 15, message: 'Requested business cannot be found.' }]
      });

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

    it(`And valid order when updating said order with an actionId
          Then return updated order`, () => {
      const order: OrderUpdateRequest = JSON.parse(JSON.stringify(singleOrderToUpdate));
      order.actionId = 'some-action-id';
      order.id = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      order.fulfillments!.push({
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
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPut(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}/${order.id}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Action-Id']).to.equal('some-action-id');
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([202, singleOrderToUpdateResponse]);
        });

      return ordersService.update(order).then((actualOrder) => {
        expect(actualOrder.id).to.equal(order.id);
        expect(actualOrder.fulfillments!.length).to.equal(1);
        expect(actualOrder.fulfillments![0].lineItems.length).to.equal(2);
        expect(actualOrder.fulfillments![0].lineItems[0].sku).to.equal('b4809155-1c5d-4b3b-affc-491ad5503007');
      });
    });

    it(`And valid order when updating said order with no actionId
          Then return updated order`, () => {
      const order: Order = JSON.parse(JSON.stringify(singleOrderToUpdate));
      order.id = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      order.fulfillments!.push({
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
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPut(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}/${order.id}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Action-Id']).to.be.undefined;
          expect(Object.keys(data.headers).length).to.equal(3);
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([202, singleOrderToUpdateResponse]);
        });

      return ordersService.update(order).then((actualOrder) => {
        expect(actualOrder.id).to.equal(order.id);
        expect(actualOrder.fulfillments!.length).to.equal(1);
        expect(actualOrder.fulfillments![0].lineItems.length).to.equal(2);
        expect(actualOrder.fulfillments![0].lineItems[0].sku).to.equal('b4809155-1c5d-4b3b-affc-491ad5503007');
      });
    });

    it(`And valid order when patching said order with an actionId
          Then return patched order`, () => {
      const newCity = 'Fargo';
      const newAddress1 = '123 Test Lane';
      const newProvince = 'North Dakota';

      const order: OrderPatchRequest = JSON.parse(JSON.stringify(singleOrderToPatch));
      order.id = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      order.actionId = 'some-action-id';
      order.customer = {
        shippingAddress: {
          address1: newAddress1,
          city: newCity,
          province: newProvince
        }
      };
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPatch(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}/${order.id}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Action-Id']).to.equal('some-action-id');
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([202, singleOrderToPatchResponse]);
        });

      return ordersService.patch(order).then((actualOrder) => {
        expect(actualOrder.id).to.equal(order.id);
        expect(actualOrder.customer!.shippingAddress!.address1).to.equal(newAddress1);
        expect(actualOrder.customer!.shippingAddress!.city).to.equal(newCity);
        expect(actualOrder.customer!.shippingAddress!.province).to.equal(newProvince);
      });
    });

    it(`And valid order when patching said order with no actionId
          Then return patched order`, () => {
      const newCity = 'Fargo';
      const newAddress1 = '123 Test Lane';
      const newProvince = 'North Dakota';

      const order: OrderPatchRequest = JSON.parse(JSON.stringify(singleOrderToPatch));
      order.id = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      order.customer = {
        shippingAddress: {
          address1: newAddress1,
          city: newCity,
          province: newProvince
        }
      };
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPatch(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}/${order.id}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Action-Id']).to.be.undefined;
          expect(Object.keys(data.headers).length).to.equal(3);
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([202, singleOrderToPatchResponse]);
        });

      return ordersService.patch(order).then((actualOrder) => {
        expect(actualOrder.id).to.equal(order.id);
        expect(actualOrder.customer!.shippingAddress!.address1).to.equal(newAddress1);
        expect(actualOrder.customer!.shippingAddress!.city).to.equal(newCity);
        expect(actualOrder.customer!.shippingAddress!.province).to.equal(newProvince);
      });
    });

    it('And valid OrderCreateRequest with an actionId when creating an order, Then return created order', () => {
      const orderCreateRequest: OrderCreateRequest = JSON.parse(JSON.stringify(singleOrder));
      orderCreateRequest.actionId = 'some-action-id';
      orderCreateRequest.fulfillments!.push({
        additionalFields: [
          {
            name: 'some-addtl-field',
            value: 'some-value'
          }
        ],
        id: 'fulfillment-id',
        lineItems: orderCreateRequest.lineItems,
        status: FulfillmentStatus.OPEN
      });
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPost(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Action-Id']).to.equal('some-action-id');
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([202, orderCreateRequest]);
        });

      return ordersService.create(orderCreateRequest).then((createdOrder) => {
        expect(createdOrder.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a', 'order.id');
        expect(createdOrder.purchaseOrderNumber).to.equal('123456', 'order.purchaseOrderNumber');
        expect(createdOrder.totalPrice).to.equal(31.93, 'totalPrice');
        expect(createdOrder.fulfillments!.length).to.equal(1, 'fulfillments.length');
        expect(createdOrder.fulfillments![0].lineItems.length).to.equal(2, 'fulfillments.lineItems.length');
        expect(createdOrder.fulfillments![0].lineItems[0].sku)
          .to.equal('e67f1d90-824a-4941-8497-08d632763c93', 'fulfillments.lineItems.sku');
        // @ts-ignore
        expect(createdOrder.refunds.length).to.equal(1);
        // @ts-ignore
        const expectedRefund = singleOrder.refunds[0];
        // @ts-ignore
        const actualRefund1 = createdOrder.refunds[0];
        expect(actualRefund1.channelRefundId).to.equal(expectedRefund.channelRefundId);
        expect(actualRefund1.supplierRefundId).to.equal(expectedRefund.supplierRefundId);
        expect(2).to.equal(expectedRefund.lineItems.length);
        expect(actualRefund1.lineItems[0].sku).to.equal(expectedRefund.lineItems[0].sku);
        expect(actualRefund1.lineItems[0].upc).to.equal(expectedRefund.lineItems[0].upc);
        expect(actualRefund1.lineItems[0].quantity).to.equal(expectedRefund.lineItems[0].quantity);
        expect(actualRefund1.lineItems[0].id).to.equal(expectedRefund.lineItems[0].id);
        expect(actualRefund1.lineItems[0].price).to.equal(expectedRefund.lineItems[0].price);
        expect(actualRefund1.lineItems[0].restockType).to.equal(expectedRefund.lineItems[0].restockType);
        expect(actualRefund1.lineItems[1].sku).to.equal(expectedRefund.lineItems[1].sku);
        expect(actualRefund1.lineItems[1].upc).to.equal(expectedRefund.lineItems[1].upc);
        expect(actualRefund1.lineItems[1].quantity).to.equal(expectedRefund.lineItems[1].quantity);
        expect(actualRefund1.lineItems[1].id).to.equal(expectedRefund.lineItems[1].id);
        expect(actualRefund1.lineItems[1].price).to.equal(expectedRefund.lineItems[1].price);
        expect(actualRefund1.lineItems[1].restockType).to.equal(expectedRefund.lineItems[1].restockType);
      });
    });

    it('And valid OrderCreateRequest with no actionId when creating an order, Then return created order', () => {
      const orderCreateRequest: OrderCreateRequest = JSON.parse(JSON.stringify(singleOrder));
      orderCreateRequest.fulfillments!.push({
        additionalFields: [
          {
            name: 'some-addtl-field',
            value: 'some-value'
          }
        ],
        id: 'fulfillment-id',
        lineItems: orderCreateRequest.lineItems,
        status: FulfillmentStatus.OPEN
      });
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPost(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Action-Id']).to.be.undefined;
          expect(Object.keys(data.headers).length).to.equal(3);
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([202, orderCreateRequest]);
        });

      return ordersService.create(orderCreateRequest).then((createdOrder) => {
        expect(createdOrder.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a', 'order.id');
        expect(createdOrder.purchaseOrderNumber).to.equal('123456', 'order.purchaseOrderNumber');
        expect(createdOrder.totalPrice).to.equal(31.93, 'totalPrice');
        expect(createdOrder.fulfillments!.length).to.equal(1, 'fulfillments.length');
        expect(createdOrder.fulfillments![0].lineItems.length).to.equal(2, 'fulfillments.lineItems.length');
        expect(createdOrder.fulfillments![0].lineItems[0].sku)
          .to.equal('e67f1d90-824a-4941-8497-08d632763c93', 'fulfillments.lineItems.sku');
      });
    });
  });

  describe('Given some invalid rest client', () => {
    it(`And invalid orderId
            When retrieving order Then return rejected promise with ChannelApeError`, () => {
      const expectedErrorMessage =
        `get /v1/orders/not-a-real-order-id
  Status: 401
  Response Body:
  Request failed with status code 401
Code: 12 Message: Invalid authorization token. Please check the server logs and try again`;
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet().reply(401,
        {
          errors:
            [{ code: 12, message: 'Invalid authorization token. Please check the server logs and try again' }]
        });
      const client: RequestClientWrapper = new RequestClientWrapper({
        endpoint: 'this-is-not-a-real-base-url',
        maximumRequestRetryTimeout: 10000,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: 50,
        maximumRequestRetryRandomDelay: 50,
        maximumConcurrentConnections: 5
      });
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
      const client: RequestClientWrapper = new RequestClientWrapper({
        endpoint: 'this-is-not-a-real-base-url',
        maximumRequestRetryTimeout: 10000,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: 50,
        maximumRequestRetryRandomDelay: 50,
        maximumConcurrentConnections: 5
      });
      const expectedErrorMessage =
        `get /v1/orders
  Status: 401
  Response Body:
  Request failed with status code 401
Code: 12 Message: Invalid authorization token. Please check the server logs and try again`;
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
