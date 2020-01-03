import OrdersService from '../../../../src/orders/service/OrdersService';
import { expect } from 'chai';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import LogLevel from '../../../../src/model/LogLevel';
import Environment from '../../../../src/model/Environment';
import RequestClientWrapper from '../../../../src/RequestClientWrapper';
import Resource from '../../../../src/model/Resource';
import Version from '../../../../src/model/Version';

import OrderActivityOperation from '../../../../src/orders/service/activities/model/OrderActivityOperation';
import OrderActivityResult from '../../../../src/orders/service/activities/model/OrderActivityResult';
import OrderActivityCreateRequestByChannel
  from '../../../../src/orders/service/activities/model/OrderActivityCreateRequestByChannel';
import OrderActivityCreateRequestByBusiness
  from '../../../../src/orders/service/activities/model/OrderActivityCreateRequestByBusiness';

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
}, axios);

const ordersService: OrdersService = new OrdersService(clientWrapper);

describe('OrdersActivitiesService', () => {
  describe('Given some valid rest client', () => {
    describe(`Given an order exists with channelId "channel-id-1", channelOrderId "channel-order-id-1",
      on businessId "business-id-1"`, () => {

      it(`And valid OrderActivityCreateRequest with channelId of "channel-id-1" and channelOrderId
        of "channel-order-id-1" when creating an order activity, Then return created order activity`, () => {
        const expectedChannelId = 'channel-id-1';
        const expectedChannelOrderId = 'channel-order-id-1';
        const expectedActionId = 'action-id';
        const expectedCompletionDate = new Date();
        const orderActivityCreateRequest: OrderActivityCreateRequestByChannel = {
          channelId: expectedChannelId,
          channelOrderId: expectedChannelOrderId,
          actionId: expectedActionId,
          operation: OrderActivityOperation.UPDATE,
          result: OrderActivityResult.SUCCESS,
          completionTime: expectedCompletionDate,
          messages: [{ description: 'Order was updated by ChannelApe SDK unit test.', title: 'CA SDK unit test' }]
        };
        const mockedAxiosAdapter = new axiosMockAdapter(axios);
        mockedAxiosAdapter.onPost(
          `${Environment.STAGING}/${Version.V1}${Resource.ORDERS_ACTIVITY}`
        )
          .reply((data) => {
            expect(data.headers['X-Channel-Ape-Action-Id']).to.be.undefined;
            expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
            return Promise.resolve([202, orderActivityCreateRequest]) as any;
          });

        return ordersService.activities().create(orderActivityCreateRequest).then((createdOrderActivity) => {
          expect(createdOrderActivity.channelId).to.equal(expectedChannelId);
          expect(createdOrderActivity.completionTime.toString()).to.equal(expectedCompletionDate.toString());
        });
      });

      it(`And valid OrderActivityCreateRequest with businessId of "business-id-1" and channelOrderId
        of "channel-order-id-1" when creating an order activity, Then return created order activity`, () => {
        const expectedBusinessId = 'business-id-1';
        const expectedOrderId = 'order-id-1';
        const expectedChannelOrderId = 'channel-order-id-1';
        const expectedCompletionDate = new Date();
        const orderActivityCreateRequest: OrderActivityCreateRequestByBusiness = {
          businessId: expectedBusinessId,
          channelOrderId: expectedChannelOrderId,
          operation: OrderActivityOperation.UPDATE,
          result: OrderActivityResult.SUCCESS,
          completionTime: expectedCompletionDate,
          messages: [{ description: 'Order was updated by ChannelApe SDK unit test.', title: 'CA SDK unit test' }]
        };
        const mockedAxiosAdapter = new axiosMockAdapter(axios);
        mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}`)
          .reply(200, {
            orders: [{
              orderId: expectedOrderId,
              lineItems: [],
              fulfillments: []
            }],
            pagination: { lastPage: true }
          });
        mockedAxiosAdapter.onPost(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS_ACTIVITY}`)
          .reply((data) => {
            expect(data.headers['X-Channel-Ape-Action-Id']).to.be.undefined;
            return [202, {
              businessId: expectedBusinessId,
              orderId: expectedOrderId,
              operation: OrderActivityOperation.UPDATE,
              result: OrderActivityResult.SUCCESS,
              completionTime: expectedCompletionDate,
              messages: [{ description: 'Order was updated by ChannelApe SDK unit test.', title: 'CA SDK unit test' }]
            }];
          });

        return ordersService.activities().create(orderActivityCreateRequest).then((createdOrderActivity) => {
          expect(createdOrderActivity.orderId).to.equal(expectedOrderId);
          expect(createdOrderActivity.completionTime.toString()).to.equal(expectedCompletionDate.toString());
        });
      });
    });

    describe(`Given two orders exists with channelId "channel-id-2", channelOrderId "channel-order-id-2",
      on businessId "business-id-2"`, () => {

      it(`And valid OrderActivityCreateRequest with businessId of "business-id-2" and channelOrderId
        of "channel-order-id-2" when creating an order activity, Then return created order activity`, () => {
        const expectedBusinessId = 'business-id-2';
        const expectedOrderId = 'order-id-2';
        const expectedChannelOrderId = 'channel-order-id-2';
        const expectedCompletionDate = new Date();
        const orderActivityCreateRequest: OrderActivityCreateRequestByBusiness = {
          businessId: expectedBusinessId,
          channelOrderId: expectedChannelOrderId,
          operation: OrderActivityOperation.UPDATE,
          result: OrderActivityResult.SUCCESS,
          completionTime: expectedCompletionDate,
          messages: [{ description: 'Order was updated by ChannelApe SDK unit test.', title: 'CA SDK unit test' }]
        };
        const mockedAxiosAdapter = new axiosMockAdapter(axios);
        mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}`)
          .reply(200, {
            orders: [{
              channelOrderId: 'channel-order-id',
              orderId: expectedOrderId,
              lineItems: [],
              fulfillments: []
            }, {
              channelOrderId: 'channel-order-id',
              orderId: expectedOrderId,
              lineItems: [],
              fulfillments: []
            }],
            pagination: { lastPage: true }
          });

        return ordersService.activities().create(orderActivityCreateRequest).then(() => {
          throw new Error('Create order activity did not throw an error');
        }).catch((error) => {
          expect(error.message).to.equal(`Order could not be discerned,
          2 orders exist on businessId ${orderActivityCreateRequest.businessId} with channelOrderId of
          ${orderActivityCreateRequest.channelOrderId}`);
        });
      });
    });

    describe(`Given zero orders exists with channelId "channel-id-2", channelOrderId "channel-order-id-2",
      on businessId "business-id-2"`, () => {

      it(`And valid OrderActivityCreateRequest with businessId of "business-id-2" and channelOrderId
        of "channel-order-id-2" when creating an order activity, Then return created order activity`, () => {
        const expectedBusinessId = 'business-id-2';
        const expectedChannelOrderId = 'channel-order-id-2';
        const expectedCompletionDate = new Date();
        const orderActivityCreateRequest: OrderActivityCreateRequestByBusiness = {
          businessId: expectedBusinessId,
          channelOrderId: expectedChannelOrderId,
          operation: OrderActivityOperation.UPDATE,
          result: OrderActivityResult.SUCCESS,
          completionTime: expectedCompletionDate,
          messages: [{ description: 'Order was updated by ChannelApe SDK unit test.', title: 'CA SDK unit test' }]
        };
        const mockedAxiosAdapter = new axiosMockAdapter(axios);
        mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.ORDERS}`)
          .reply(200, {
            orders: [],
            pagination: { lastPage: true }
          });

        return ordersService.activities().create(orderActivityCreateRequest).then(() => {
          throw new Error('Create order activity did not throw an error');
        }).catch((error) => {
          expect(error.message).to.equal(`Order could not be discerned,
          no orders exist on businessId ${orderActivityCreateRequest.businessId} with channelOrderId of
          ${orderActivityCreateRequest.channelOrderId}`);
        });
      });
    });
  });

  describe('Given some invalid rest client', () => {
    it(`And invalid order activity creation request
            When creating an order activity Then return rejected promise with ChannelApeError`, () => {
      const expectedErrorMessage =
`post v1/orders/activities
  Status: 400
  Response Body:
  Request failed with status code 400
Code: 213 Message: Attribute: channelId is required. Please specify field channelId for this request.
Code: 167 Message: Channel order ID cannot be blank.`;
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPost().reply(400, {
        errors: [
          {
            code: 213,
            message: 'Attribute: channelId is required. Please specify field channelId for this request.'
          },
          {
            code: 167,
            message: 'Channel order ID cannot be blank.'
          }
        ]
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
      }, axios);
      const ordersService: OrdersService = new OrdersService(client);
      return ordersService.activities().create({} as any).then((actualOrderActivity) => {
        throw new Error('Test failed!');
      })
      .catch((e) => {
        expect(e.message).to.equal(expectedErrorMessage);
      });
    });

    it(`And channelApe returns an unexpected status code
            When creating an order activity Then return rejected promise with ChannelApeError`, () => {
      const expectedErrorMessage =
`post v1/orders/activities
  Status: 200
  Response Body:
  Expected Status 202 but got 200`;
      const channelId = 'not-a-real-channel-id';
      const requestOptions: OrderActivityCreateRequestByChannel = {
        channelId,
        channelOrderId: 'some-channel-order-id',
        operation: OrderActivityOperation.UPDATE,
        result: OrderActivityResult.SUCCESS
      };
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPost().reply(200);
      return ordersService.activities().create(requestOptions).then(() => {
        throw new Error('Test failed!');
      })
      .catch((e) => {
        expect(e.message).to.equal(expectedErrorMessage);
      });
    });
  });
});
