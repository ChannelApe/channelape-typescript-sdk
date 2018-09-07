import ChannelApeError from '../src/model/ChannelApeError';
import ChannelApeApiError from '../src/model/ChannelApeApiError';
import ChannelApeClient from '../src/ChannelApeClient';
import OrderStatus from '../src/orders/model/OrderStatus';
import { expect } from 'chai';
import OrdersQueryRequestByBusinessId from '../src/orders/model/OrdersQueryRequestByBusinessId';
import { LogLevel } from 'channelape-logger';

describe('ChannelApe Client', () => {
  describe('Given valid session ID', () => {
    const sessionId = getSessionId();

    const channelApeClient = new ChannelApeClient({
      sessionId,
      logLevel: LogLevel.OFF,
      maximumRequestRetryRandomDelay: 2000,
      minimumRequestRetryRandomDelay: 500,
      maximumRequestRetryTimeout: 30000
    });

    describe('And valid action ID for action with error processing status', () => {
      context('When retrieving action', () => {
        it('Then return action', () => {
          const expectedActionId = 'a85d7463-a2f2-46ae-95a1-549e70ecb2ca';
          const actualActionPromise = channelApeClient.actions().get(expectedActionId);
          return actualActionPromise.then((actualAction) => {
            expect(actualAction.action).to.equal('PRODUCT_PULL');
            expect(actualAction.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualAction.description).to.equal('Encountered error during product pull for Europa Sports');
            expect(actualAction.healthCheckIntervalInSeconds).to.equal(300);
            expect(actualAction.id).to.equal(expectedActionId);
            expect(actualAction.lastHealthCheckTime.toISOString())
              .to.equal(new Date('2018-04-24T14:02:34.703Z').toISOString());
            expect(actualAction.processingStatus).to.equal('error');
            expect(actualAction.startTime.toISOString())
              .to.equal(new Date('2018-04-24T14:02:34.703Z').toISOString());
            expect(actualAction.targetId).to.equal('1e4ebaa6-9796-4ccf-bd73-8765893a66bd');
            expect(actualAction.targetType).to.equal('supplier');
            expect(actualAction.endTime).to.equal(undefined);
          });
        });
      });
    });

    describe('And valid action ID for action with completed processing status', () => {
      context('When retrieving action', () => {
        it('Then return action', () => {
          const expectedActionId = '4da63571-a4c5-4774-ae20-4fee24ab98e5';
          const actualActionPromise = channelApeClient.actions().get(expectedActionId);
          return actualActionPromise.then((actualAction) => {
            expect(actualAction.action).to.equal('PRODUCT_PUSH');
            expect(actualAction.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualAction.description).to.equal('Completed product push for Custom Column Export');
            expect(actualAction.healthCheckIntervalInSeconds).to.equal(300);
            expect(actualAction.id).to.equal(expectedActionId);
            expect(actualAction.lastHealthCheckTime.toISOString())
              .to.equal(new Date('2018-05-01T14:47:58.018Z').toISOString());
            expect(actualAction.processingStatus).to.equal('completed');
            expect(actualAction.startTime.toISOString())
              .to.equal(new Date('2018-05-01T14:47:55.905Z').toISOString());
            expect(actualAction.targetId).to.equal('9c728601-0286-457d-b0d6-ec19292d4485');
            expect(actualAction.targetType).to.equal('channel');
            if (actualAction.endTime == null) {
              expect(actualAction.endTime).to.not.equal(undefined);
            } else {
              expect(actualAction.endTime.toISOString())
                .to.equal(new Date('2018-05-01T14:47:58.018Z').toISOString());
            }
          });
        });
      });
    });

    describe('And invalid action ID', () => {
      context('When retrieving action', () => {
        it('Then return 404 status code and action not found error message', () => {
          const expectedActionId = '676cb925-b603-4140-a3dd-2af160c257d1';
          const actualActionPromise = channelApeClient.actions().get(expectedActionId);
          return actualActionPromise.then((actualAction) => {
            throw new Error('Expected rejected promise');
          }).catch((actualChannelApeError: ChannelApeError) => {
            expect(actualChannelApeError.Response.statusCode).to.equal(404);
            const expectedChannelApeApiErrors = [{
              code: 111,
              message: 'Action could not be found.'
            }];
            assertChannelApeErrors(expectedChannelApeApiErrors, actualChannelApeError.ApiErrors);
          });
        });
      });
    });

    describe('And valid channel ID', () => {
      context('When retrieving channel', () => {
        it('Then return channel', () => {
          const expectedChannelId = '9c728601-0286-457d-b0d6-ec19292d4485';
          const actualChannelPromise = channelApeClient.channels().get(expectedChannelId);
          return actualChannelPromise.then((actualChannel) => {
            expect(actualChannel.id).to.equal('9c728601-0286-457d-b0d6-ec19292d4485');
            expect(actualChannel.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualChannel.enabled).to.equal(true);
            expect(actualChannel.integrationId).to.equal('02df0b31-a071-4791-b9c2-aa01e4fb0ce6');
            expect(actualChannel.name).to.equal('EuropaSports Snacks / Foods');
            expect(actualChannel.settings.allowCreate).to.equal(false);
            expect(actualChannel.settings.allowRead).to.equal(true);
            expect(actualChannel.settings.allowUpdate).to.equal(false);
            expect(actualChannel.settings.allowDelete).to.equal(false);
            expect(actualChannel.settings.disableVariants).to.equal(false);
            expect(actualChannel.settings.priceType).to.equal('retail');
            expect(actualChannel.settings.updateFields).to.have.same.members([
              'images',
              'inventoryQuantity',
              'vendor',
              'price',
              'weight',
              'description',
              'title',
              'tags'
            ]);
            const expectedCreatedAt = new Date('2018-02-22T16:04:29.030Z');
            expect(actualChannel.createdAt.toISOString()).to.equal(expectedCreatedAt.toISOString());
            expect(actualChannel.updatedAt.getUTCMilliseconds())
              .to.be.greaterThan(expectedCreatedAt.getUTCMilliseconds());
          });
        });
      });
    });

    describe('And valid order ID', () => {
      context('When retrieving order', () => {
        it('Then return order', () => {
          const expectedOrderId = '3bc9120d-b706-49cd-ad81-6445ce77d8ad';
          const actualOrderPromise = channelApeClient.orders().get(expectedOrderId);
          return actualOrderPromise.then((actualOrder) => {
            expect(actualOrder.id).to.equal(expectedOrderId);
            expect(actualOrder.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualOrder.status).to.equal(OrderStatus.OPEN);
            expect(actualOrder.lineItems.length).to.equal(2);
            expect(actualOrder.lineItems[0].sku).to.equal('e67f1d90-824a-4941-8497-08d632763c93');
            expect(actualOrder.lineItems[0].title).to.equal('Generic Steel Shirt');
            const expectedCreatedAt = new Date('2018-05-23T15:31:14.126Z');
            expect(actualOrder.createdAt.toISOString()).to.equal(expectedCreatedAt.toISOString());
          });
        });
      });
    });

    describe('And valid business ID', () => {
      describe('And a startDate of "2018-03-29T17:00:51.000Z" and an endDate of "2018-08-23T12:41:33.000Z"', () => {
        context('When retrieving orders', () => {
          it('Then return the 228 orders between those dates', () => {
            const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
              businessId: expectedBusinessId,
              startDate: new Date('2018-03-29T17:00:51.000Z'),
              endDate: new Date('2018-08-23T12:41:33.000Z')
            };
            const actualOrdersPromise = channelApeClient.orders().get(ordersQueryRequestByBusinessId);
            return actualOrdersPromise.then((actualOrders) => {
              expect(actualOrders).to.be.an('array');
              expect(actualOrders.length).to.equal(228);
              expect(actualOrders[0].id).to.equal('dda8a05f-d5dd-4535-9261-b55c501085ef');
            });
          });
        });
      });

      describe('And query request size of 150 And business has more than 150 orders', () => {
        context('When retrieving a single page of orders', () => {
          it('Then return a single page of 150 orders for the business', () => {
            const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
              businessId: expectedBusinessId,
              size: 150
            };
            const actualOrdersPromise = channelApeClient.orders().getPage(ordersQueryRequestByBusinessId);
            return actualOrdersPromise.then((actualOrders) => {
              expect(actualOrders.orders).to.be.an('array');
              expect(actualOrders.orders.length).to.equal(150);
              expect(actualOrders.pagination.lastPage).to.equal(false);
            });
          });
        });

        describe('And lastKey of "1f557ede-3df5-4335-a64b-cb4181943965"', () => {
          context('When retrieving the next single page of orders', () => {
            it('Then return the last single page of 51 orders for the business', () => {
              const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
              const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
                businessId: expectedBusinessId,
                lastKey: '1f557ede-3df5-4335-a64b-cb4181943965',
                size: 150
              };
              const actualOrdersPromise = channelApeClient.orders().getPage(ordersQueryRequestByBusinessId);
              return actualOrdersPromise.then((actualOrders) => {
                expect(actualOrders.orders).to.be.an('array');
                expect(actualOrders.orders.length).to.equal(51);
                expect(actualOrders.orders[0].id).to.equal('a6f23ae7-fae6-4cf3-b7b9-10eaa84d7ff2');
                expect(actualOrders.pagination.lastPage).to.equal(true);
              });
            });
          });
        });
      });
    });

  });

  function getSessionId(): string {
    const sessionIdEnvironmentVariable = process.env.CHANNEL_APE_SESSION_ID;
    if (sessionIdEnvironmentVariable == null) {
      throw new Error('CHANNEL_APE_SESSION_ID environment variable is required.');
    }
    return sessionIdEnvironmentVariable;
  }

  function assertChannelApeErrors(expectedChannelApeErrors: ChannelApeApiError[],
    actualChannelApeErrors: ChannelApeApiError[]) {

    if (Array.isArray(actualChannelApeErrors)) {
      expect(expectedChannelApeErrors.length).to.equal(actualChannelApeErrors.length,
        'expected and actual ChannelApeError arrays are different sizes, expected: '
        + JSON.stringify(expectedChannelApeErrors) + ', actual: ' + JSON.stringify(actualChannelApeErrors));

      expectedChannelApeErrors
        .sort((leftChannelApeError, rightChannelApeError) => leftChannelApeError.code - rightChannelApeError.code);
      actualChannelApeErrors
        .sort((leftChannelApeError, rightChannelApeError) => leftChannelApeError.code - rightChannelApeError.code);

      expectedChannelApeErrors.forEach((expectedChannelApeError, index) => {
        const actualChannelApeError = actualChannelApeErrors[index];
        expect(actualChannelApeError.code).to.equal(expectedChannelApeError.code,
          'Unexpected code for ChannelApeError at index ' + index);
        expect(actualChannelApeError.message).to.equal(expectedChannelApeError.message,
          'Unexpected message for ChannelApeError at index ' + index);
      });

    } else if (expectedChannelApeErrors.length > 0) {
      expect(Array.isArray(actualChannelApeErrors)).to.equal(true, 'actualChannelApeErrors should be array');
    }

  }

});
