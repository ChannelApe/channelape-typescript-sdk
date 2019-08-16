import { expect } from 'chai';
import { LogLevel } from 'channelape-logger';
import * as faker from 'faker';

import ChannelApeError from '../src/model/ChannelApeError';
import ChannelApeApiError from '../src/model/ChannelApeApiError';
import ChannelApeClient from '../src/ChannelApeClient';
import OrderStatus from '../src/orders/model/OrderStatus';
import OrdersQueryRequestByBusinessId from '../src/orders/model/OrdersQueryRequestByBusinessId';
import Channel from '../src/channels/model/Channel';
import Supplier from '../src/suppliers/model/Supplier';
import VariantsRequestByProductId from '../src/variants/model/VariantsRequestByProductId';
import VariantsRequest from '../src/variants/model/VariantsRequest';
import VariantsSearchRequestByProductFilterId from '../src/variants/model/VariantsSearchRequestByProductFilterId';
import VariantsSearchRequestByVendor from '../src/variants/model/VariantsSearchRequestByVendor';
import VariantsSearchRequestBySku from '../src/variants/model/VariantsSearchRequestBySku';
import VariantsSearchRequestByUpc from '../src/variants/model/VariantsSearchRequestByUpc';
import VariantsSearchRequestByTag from '../src/variants/model/VariantsSearchRequestByTag';
import OrderCreateRequest from '../src/orders/model/OrderCreateRequest';
import OrderActivityOperation from '../src/orders/service/activities/model/OrderActivityOperation';
import OrderActivityResult from '../src/orders/service/activities/model/OrderActivityResult';
import ProductFilterRequest from '../src/products/filters/models/ProductFilterRequest';
import VariantsPage from '../src/variants/model/VariantsPage';

describe('ChannelApe Client', () => {
  describe('Given valid session ID', () => {
    const sessionId = getSessionId();

    const channelApeClient = new ChannelApeClient({
      sessionId,
      logLevel: LogLevel.OFF,
      maximumRequestRetryRandomDelay: 2000,
      minimumRequestRetryRandomDelay: 1000,
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

    describe('And valid action ID for action with completed processing status', () => {
      context('When updating action', () => {
        it('Then expect action already completed', () => {
          const expectedActionId = '4da63571-a4c5-4774-ae20-4fee24ab98e5';
          return channelApeClient.actions().updateHealthCheck(expectedActionId).then((actualAction) => {
            throw new Error('Should not have succeeded');
          })
          .catch((e) => {
            expect(e.message).includes('Action has already been completed');
          });
        });
      });
    });

    describe('And valid channel ID', () => {
      context('When retrieving channel', () => {
        it('Then return channel', () => {
          const expectedChannelId = '9c728601-0286-457d-b0d6-ec19292d4485';
          const actualChannelPromise = channelApeClient.channels().get(expectedChannelId);
          return actualChannelPromise.then(assertChannelEuropaSportsSnackFoods);
        });
      });
    });

    describe('And valid business ID', () => {
      context('When retrieving channels', () => {
        it('Then return channels', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const actualChannelsPromise = channelApeClient.channels().get({
            businessId: expectedBusinessId
          });
          return actualChannelsPromise.then((channels) => {
            expect(channels).to.be.an('array');
            let i: number;
            for (i = 0; i < channels.length; i += 1) {
              if (channels[i].id === '9c728601-0286-457d-b0d6-ec19292d4485') {
                break;
              }
            }
            assertChannelEuropaSportsSnackFoods(channels[i]);
          });
        });
      });
    });

    describe('And valid supplier ID', () => {
      context('When retrieving supplier', () => {
        it('Then return supplier', () => {
          const expectedSupplierId = '1e4ebaa6-9796-4ccf-bd73-8765893a66bd';
          const actualSupplierPromise = channelApeClient.suppliers().get(expectedSupplierId);
          return actualSupplierPromise.then(assertSupplierEuropaSportsSnackFoods);
        });
      });
    });

    describe('And valid business ID', () => {
      context('When retrieving suppliers', () => {
        it('Then return suppliers', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const actualSuppliersPromise = channelApeClient.suppliers().get({
            businessId: expectedBusinessId
          });
          return actualSuppliersPromise.then((suppliers) => {
            expect(suppliers).to.be.an('array');
            let i: number;
            for (i = 0; i < suppliers.length; i += 1) {
              if (suppliers[i].id === '1e4ebaa6-9796-4ccf-bd73-8765893a66bd') {
                break;
              }
            }
            assertSupplierEuropaSportsSnackFoods(suppliers[i]);
          });
        });
      });
    });

    describe('And valid order ID', () => {
      context('When retrieving order', () => {
        it('Then return order', () => {
          const expectedOrderId = '3ee243dc-d768-4ad6-8008-a14ccc834036';
          const actualOrderPromise = channelApeClient.orders().get(expectedOrderId);
          return actualOrderPromise.then((actualOrder) => {
            expect(actualOrder.id).to.equal(expectedOrderId);
            expect(actualOrder.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualOrder.status).to.equal(OrderStatus.OPEN);
            expect(actualOrder.lineItems.length).to.equal(4);
            expect(actualOrder.lineItems[0].sku).to.equal(undefined);
            expect(actualOrder.lineItems[0].title).to.equal('Awesome Cotton Ball');
            expect(actualOrder.fulfillments!.length).to.equal(1);
            const expectedShippedAt = new Date('2019-02-11T22:39:11.407Z');
            expect(actualOrder.fulfillments![0].shippedAt!.toISOString()).to.equal(expectedShippedAt.toISOString());
            const expectedCreatedAt = new Date('2019-02-11T22:39:13.397Z');
            expect(actualOrder.createdAt.toISOString()).to.equal(expectedCreatedAt.toISOString());
          });
        });
      });

      context('When retrieving order with a refund', () => {
        it('Then return order', () => {
          const expectedOrderId = '2a94d852-5b3e-4dd4-ba2b-cec8295f2318';
          const actualOrderPromise = channelApeClient.orders().get(expectedOrderId);
          return actualOrderPromise.then((actualOrder) => {
            expect(actualOrder.id).to.equal(expectedOrderId);
            expect(actualOrder.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualOrder.status).to.equal(OrderStatus.OPEN);
            expect(actualOrder.refunds![0].lineItems[0].quantity).to.equal(2);
            expect(actualOrder.refunds![0].channelRefundId).to.equal('74273487234');
            expect(actualOrder.refunds![0].supplierRefundId).to.equal('7348234');
          });
        });
      });
    });

    describe('And valid order', () => {
      context('When updating order', () => {
        it('Then update the order', () => {
          const expectedOrderId = '3bc9120d-b706-49cd-ad81-6445ce77d8ad';
          return channelApeClient.orders().get(expectedOrderId).then((actualOrder) => {
            expect(actualOrder.id).to.equal(expectedOrderId);
            const randomFirstName = Math.random().toString();
            const randomLastName = Math.random().toString();
            const fullName = `${randomFirstName} ${randomLastName}`;
            actualOrder.customer!.firstName! = randomFirstName;
            actualOrder.customer!.lastName! = randomLastName;
            actualOrder.customer!.name! = fullName;
            return channelApeClient.orders().update(actualOrder).then((actualUpdatedOrder) => {
              expect(actualUpdatedOrder.id).to.equal(actualUpdatedOrder.id);
              expect(actualUpdatedOrder.customer!.firstName!).to.equal(randomFirstName);
              expect(actualUpdatedOrder.customer!.lastName!).to.equal(randomLastName);
              expect(actualUpdatedOrder.customer!.name!).to.equal(fullName);
            });
          });
        });
      });
    });

    describe('And valid order', () => {
      context('When patching order', () => {
        it('Then patch the order', () => {
          const expectedOrderId = '9f53ade6-5ed0-4fa1-8361-16bdf5852eab';
          return channelApeClient.orders().get(expectedOrderId).then((actualOrder) => {
            expect(actualOrder.id).to.equal(expectedOrderId);
            const fakeAddress = faker.address.streetAddress();
            const fakeCity = faker.address.city();
            const fakeProvince = faker.address.state();
            const fakeProvinceCode = fakeCity.substr(0, 2).toUpperCase();
            if (!actualOrder.customer) {
              actualOrder.customer = {};
            }
            if (!actualOrder.customer.shippingAddress) {
              actualOrder.customer.shippingAddress = {};
            }
            actualOrder.customer!.shippingAddress!.address1 = fakeAddress;
            actualOrder.customer!.shippingAddress!.city = fakeCity;
            actualOrder.customer!.shippingAddress!.province = fakeProvince;
            actualOrder.customer!.shippingAddress!.provinceCode = fakeProvinceCode;
            return channelApeClient.orders().patch(actualOrder).then((actualUpdatedOrder) => {
              expect(actualUpdatedOrder.id).to.equal(actualUpdatedOrder.id);
              expect(actualUpdatedOrder.customer!.shippingAddress!.address1).to.equal(fakeAddress);
              expect(actualUpdatedOrder.customer!.shippingAddress!.city).to.equal(fakeCity);
              expect(actualUpdatedOrder.customer!.shippingAddress!.province).to.equal(fakeProvince);
              expect(actualUpdatedOrder.customer!.shippingAddress!.provinceCode).to.equal(fakeProvinceCode);
            });
          });
        });
      });
    });

    describe('And valid order create request', () => {
      context('When creating an order', () => {
        it('Then create the order', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedChannelId = '1b45b1a5-931c-454d-9385-23228b750faf';
          const expectedFirstName = faker.name.firstName();
          const expectedLastName = faker.name.lastName();
          const expectedChannelOrderId = Math.random().toString();
          const fullName = `${expectedFirstName} ${expectedLastName}`;
          const expectedLineItemQuantities = [
            faker.random.number(20) + 1,
            faker.random.number(20) + 1,
            faker.random.number(20) + 1,
            faker.random.number(20) + 1,
          ];
          const expectedLineItemTitles = [
            faker.commerce.productName(),
            faker.commerce.productName(),
            faker.commerce.productName(),
            faker.commerce.productName()
          ];
          const expectedOrderStatus = OrderStatus.OPEN;
          const expectedPurchasedAtDate = new Date();

          const orderToCreate: OrderCreateRequest = {
            additionalFields: [
              { name: 'name', value: `SDK${parseInt((Math.random() * 100000).toString(), 10).toString()}` },
              { name: 'order_number', value: parseInt((Math.random() * 100000).toString(), 10).toString() }
            ],
            totalPrice: faker.random.number({ min: 1, max: 700, precision: 2 }),
            alphabeticCurrencyCode: 'USD',
            channelId: expectedChannelId,
            channelOrderId: expectedChannelOrderId,
            customer: {
              firstName: expectedFirstName,
              lastName: expectedLastName,
              name: fullName,
              additionalFields: [
                { name: 'extraCustomerData', value: faker.random.words(5) }
              ]
            },
            status: expectedOrderStatus,
            purchasedAt: expectedPurchasedAtDate,
            lineItems: []
          };
          for (let i = 0; i < 4; i += 1) {
            orderToCreate.lineItems.push({
              id: (i + 1).toString(),
              quantity: expectedLineItemQuantities[i],
              title: expectedLineItemTitles[i],
              additionalFields: [
                { name: 'extraLineItemData', value: faker.random.words(5) }
              ]
            });
          }

          return channelApeClient.orders().create(orderToCreate).then((createdOrder) => {
            expect(createdOrder.businessId).to.equal(expectedBusinessId);
            expect(createdOrder.totalPrice).to.equal(orderToCreate.totalPrice);
            expect(createdOrder.additionalFields![0].name).to.equal('name');
            expect(createdOrder.additionalFields![0].value)
              .to.equal(orderToCreate.additionalFields![0].value);
            expect(createdOrder.additionalFields![1].name).to.equal('order_number');
            expect(createdOrder.additionalFields![1].value)
              .to.equal(orderToCreate.additionalFields![1].value);
            expect(createdOrder.channelId).to.equal(expectedChannelId, 'channelId');
            expect(createdOrder.customer!.firstName!).to.equal(expectedFirstName, 'customer.firstName');
            expect(createdOrder.customer!.lastName!).to.equal(expectedLastName, 'customer.lastName');
            expect(createdOrder.customer!.additionalFields![0].name)
              .to.equal(orderToCreate.customer!.additionalFields![0].name);
            expect(createdOrder.customer!.additionalFields![0].value)
              .to.equal(orderToCreate.customer!.additionalFields![0].value);
            expect(createdOrder.customer!.name!).to.equal(fullName, 'customer.name');
            expect(createdOrder.lineItems.length).to.equal(4, 'line item length');
            expect(createdOrder.channelOrderId).to.equal(expectedChannelOrderId);
            for (let i = 0; i < 4; i += 1) {
              expect(createdOrder.lineItems[i].id).to.equal((i + 1).toString(), `lineItem[${i}].id`);
              expect(createdOrder.lineItems[i].quantity).to.equal(expectedLineItemQuantities[i],
                `lineItem[${i}].quantity`);
              expect(createdOrder.lineItems[i].title).to.equal(expectedLineItemTitles[i], `lineItem[${i}].title`);
              expect(createdOrder.lineItems[i].additionalFields![0].name)
                .to.equal(orderToCreate.lineItems[i].additionalFields![0].name);
              expect(createdOrder.lineItems[i].additionalFields![0].value)
                .to.equal(orderToCreate.lineItems[i].additionalFields![0].value);
            }
          });
        });
      });
    });

    describe('And valid order activity create request with a channelOrderId', () => {
      context('When creating an order activity', () => {
        it('Then create the order activity', () => {
          const expectedChannelId = '1b45b1a5-931c-454d-9385-23228b750faf';
          const expectedChannelOrderId = '0.7331620496617428';
          return channelApeClient.orders().activities().create({
            channelId: expectedChannelId,
            channelOrderId: expectedChannelOrderId,
            operation: OrderActivityOperation.UPDATE,
            result: OrderActivityResult.SUCCESS,
            messages: [
              {
                description: 'Order was updated by ChannelApe SDK e2e test suite using a channelId and channelOrderId',
                title: 'CA SDK e2e test'
              }
            ]
          }).then((orderActivity) => {
            expect(orderActivity.channelId).to.equal(expectedChannelId);
          });
        });
      });
    });

    describe('And valid order activity create request with an orderId', () => {
      context('When creating an order activity', () => {
        it('Then create the order activity', () => {
          const orderId = '0133a9cd-006b-4140-a5bb-a9ee478930d0';
          return channelApeClient.orders().activities().create({
            orderId,
            operation: OrderActivityOperation.UPDATE,
            result: OrderActivityResult.SUCCESS,
            messages: [
              {
                description: 'Order was updated by ChannelApe SDK e2e test suite using just an orderId.',
                title: 'CA SDK e2e test'
              }
            ]
          }).then((orderActivity) => {
            expect(orderActivity.orderId).to.equal(orderId);
          });
        });
      });
    });

    describe('And valid order activity create request with a channelOrderId and a businessId', () => {
      context('When creating an order activity', () => {
        it('Then create the order activity', () => {
          const orderId = '0133a9cd-006b-4140-a5bb-a9ee478930d0';
          const expectedChannelOrderId = '0.7331620496617428';
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          return channelApeClient.orders().activities().create({
            businessId: expectedBusinessId,
            channelOrderId: expectedChannelOrderId,
            operation: OrderActivityOperation.UPDATE,
            result: OrderActivityResult.SUCCESS,
            messages: [
              {
                description: 'Order was updated by ChannelApe SDK e2e test suite using a channelOrderId and businessId',
                title: 'CA SDK e2e test'
              }
            ]
          }).then((orderActivity) => {
            expect(orderActivity.orderId).to.equal(orderId);
          });
        });
      });
    });

    describe('And valid business ID', () => {
      describe('And a startDate of "2018-03-29T17:00:51.000Z" and an endDate of "2018-08-23T12:41:33.000Z"', () => {
        context('When retrieving orders', () => {
          it('Then return the 230 orders between those dates', () => {
            const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
              businessId: expectedBusinessId,
              startDate: new Date('2018-03-29T17:00:51.000Z'),
              endDate: new Date('2018-08-23T12:41:33.000Z')
            };
            const actualOrdersPromise = channelApeClient.orders().get(ordersQueryRequestByBusinessId);
            return actualOrdersPromise.then((actualOrders) => {
              expect(actualOrders).to.be.an('array');
              expect(actualOrders.length).to.equal(230);
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
            it('Then return the last single page of 52 orders for the business', () => {
              const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
              const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
                businessId: expectedBusinessId,
                lastKey: '1f557ede-3df5-4335-a64b-cb4181943965',
                size: 150
              };
              const actualOrdersPromise = channelApeClient.orders().getPage(ordersQueryRequestByBusinessId);
              return actualOrdersPromise.then((actualOrders) => {
                expect(actualOrders.orders).to.be.an('array');
                expect(actualOrders.orders.length).to.equal(52);
                expect(actualOrders.orders[0].id).to.equal('a6f23ae7-fae6-4cf3-b7b9-10eaa84d7ff2');
                expect(actualOrders.pagination.lastPage).to.equal(true);
              });
            });
          });
        });
      });

      describe('And a count parameter of "true"', () => {
        context('When retrieving a single page of orders', () => {
          it('Then return a single page of 10 orders for the business and a totalItems count of "140"', () => {
            const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
              businessId: expectedBusinessId,
              size: 10,
              count: true,
              endDate: new Date('2018-06-03T16:59:54.000Z'),
              status: OrderStatus.IN_PROGRESS
            };
            const actualOrdersPromise = channelApeClient.orders().getPage(ordersQueryRequestByBusinessId);
            return actualOrdersPromise.then((actualOrders) => {
              expect(actualOrders.orders).to.be.an('array');
              expect(actualOrders.orders.length).to.equal(10);
              expect(actualOrders.pagination.lastPage).to.equal(false);
              expect(actualOrders.pagination.totalItems)
                .to.equal(140, 'There should be 140 totalItems in the pagination response');
            });
          });
        });
      });
    });

    describe('And valid productId', () => {
      context('When retrieving a products variants', () => {
        it('Then return variants for that product', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const variantsRequestByProductId: VariantsRequestByProductId = {
            productId: expectedProductId
          };
          const actualVariantsPromise = channelApeClient.variants().get(variantsRequestByProductId);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.equal(6);
          });
        });
      });
    });

    describe('And valid productId and valid variantId', () => {
      context('When retrieving a variant', () => {
        it('Then return that variant', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const expectedSku = '4820203';
          const variantsRequest: VariantsRequest = {
            productId: expectedProductId,
            inventoryItemValue: expectedSku
          };
          const actualVariantPromise = channelApeClient.variants().get(variantsRequest);
          return actualVariantPromise.then((actualVariant) => {
            expect(actualVariant.options.Flavor).to.equal('Chocolate');
            expect(actualVariant.additionalFields.walmartBrand).to.equal('MusclePharm');
            expect(actualVariant.retailPrice).to.equal(59.99);
            expect(actualVariant.title).to.equal('MusclePharm Sport Series Combat XL Mass Gainer');
          });
        });
      });
    });

    describe('And valid businessId and valid vendor', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedVendor = 'Optimum Nutrition';
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedSku = '2730117';
          const variantsRequest: VariantsSearchRequestByVendor = {
            vendor: expectedVendor,
            businessId: expectedBusinessId
          };
          const actualVariantsPromise = channelApeClient.variants().search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            const variant = actualVariants.find(v => v.sku === expectedSku);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal(expectedVendor);
            expect(variant!.title).to.equal('Optimum Nutrition Opti-Women');
          });
        });
      });
    });

    describe('And valid productFilterId', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedProductFilterId = 'f4cf2afd-fc5f-424d-bf45-868b672d77a0';
          const expectedSku = '6030038';
          const variantsRequest: VariantsSearchRequestByProductFilterId = {
            productFilterId: expectedProductFilterId
          };
          const actualVariantsPromise = channelApeClient.variants().search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.be.greaterThan(50);
            const variant = actualVariants.find(v => v.sku === expectedSku);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal('Caveman Foods');
            expect(variant!.title).to.equal('Caveman Foods Chicken Jerky');
          });
        }).timeout(25000);
      });

      context(`When searching variants
        and a size is specified`, () => {
        it('Then return variant quick search results according to size', () => {
          const expectedProductFilterId = 'f4cf2afd-fc5f-424d-bf45-868b672d77a0';
          const variantsRequest: VariantsSearchRequestByProductFilterId = {
            productFilterId: expectedProductFilterId,
            size: 10
          };
          const actualVariantsPromise = channelApeClient.variants().getPage(variantsRequest);
          return actualVariantsPromise.then((variantsPage: VariantsPage) => {
            expect(variantsPage.variantSearchResults).to.be.an('array');
            expect(variantsPage.variantSearchResults.length).to.be.equal(10);
          });
        }).timeout(25000);
      });
    });

    describe('And valid businessId and valid sku', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedSku = '6030038';
          const variantsRequest: VariantsSearchRequestBySku = {
            sku: expectedSku,
            businessId: expectedBusinessId
          };
          const actualVariantsPromise = channelApeClient.variants().search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.equal(1);
            const variant = actualVariants.find(v => v.sku === expectedSku);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal('Caveman Foods');
            expect(variant!.title).to.equal('Caveman Foods Chicken Jerky');
          });
        });
      });
    });

    describe('And valid businessId and valid upc', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedUpc = '853385003971';
          const variantsRequest: VariantsSearchRequestByUpc = {
            upc: expectedUpc,
            businessId: expectedBusinessId
          };
          const actualVariantsPromise = channelApeClient.variants().search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.equal(1);
            const variant = actualVariants.find(v => v.upc === expectedUpc);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal('Caveman Foods');
            expect(variant!.title).to.equal('Caveman Foods Chicken Jerky');
          });
        });
      });
    });

    describe('And valid businessId and valid tag', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedProductId = '00050387-9bb1-4587-becc-ff951981d0f8';
          const expectedTag = 'FresnoCaliforniaQuantityOnHand_Yes';
          const variantsRequest: VariantsSearchRequestByTag = {
            tag: expectedTag,
            businessId: expectedBusinessId
          };
          const actualVariantsPromise = channelApeClient.variants().search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            const variant = actualVariants.find(v => v.productId === expectedProductId);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal('Caveman Foods');
            expect(variant!.title).to.equal('Caveman Foods Chicken Jerky2');
            expect(variant!.tags).to.include(expectedTag);
          });
        });
      });
    });

    describe('And valid businessId with an active subscription', () => {
      context('When getting subscription', () => {
        it('Then return subscription result', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const actualSubscriptionsPromise = channelApeClient.subscriptions().get(expectedBusinessId);
          return actualSubscriptionsPromise.then((actualSubscription) => {
            expect(actualSubscription.active).to.equal(true);
            expect(actualSubscription.businessId).to.equal(expectedBusinessId);
            expect(actualSubscription.createdAt!.toISOString()).to.be.a('string');
            expect(actualSubscription.errors).to.be.an('array');
            expect(actualSubscription.errors.length).to.equal(0);
            expect(actualSubscription.lastCompletedTaskUsageRecordingTime!.toISOString()).to.be.a('string');
            expect(actualSubscription.periodEndsAt!.toISOString()).to.be.a('string');
            expect(actualSubscription.periodStartedAt!.toISOString()).to.be.a('string');
            expect(actualSubscription.subscriptionId).to.not.equal(undefined);
            expect(actualSubscription.subscriptionProductHandle).to.not.equal(undefined);
            expect(actualSubscription.updatedAt!.toISOString()).to.be.a('string');
          });
        });
      });
    });

    describe('And valid analytics report list get request', () => {
      context('When getting report list', () => {
        it('Then return report list', async () => {
          const reports = await channelApeClient.analytics().get();
          expect(reports.length).to.be.greaterThan(0);

          for (const report of reports) {
            expect(report.category).to.be.a('string');
            expect(report.embedCode).to.be.a('string');
            expect(report.name).to.be.a('string');
          }
        });
      });
    });

    describe('And valid products filter create request', () => {
      context('When creating a products filter', () => {
        it('Then create the products filter', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';

          const productFilterRequest: ProductFilterRequest = {
            businessId: expectedBusinessId
          };

          return channelApeClient.productFilters().create(productFilterRequest).then((createdFilter) => {
            expect(createdFilter.businessId).to.equal(expectedBusinessId);
            expect(createdFilter.alphabeticCurrencyCode).to.equal('USD');
            expect(createdFilter.complement).to.equal(false);
            expect(createdFilter.createdAt.toISOString()).to.be.a('string');
            expect(createdFilter.errors.length).to.equal(0);
            expect(createdFilter.id).to.be.a('string');
            expect(createdFilter.skus.length).to.equal(0);
            expect(createdFilter.tags.length).to.equal(0);
            expect(createdFilter.upcs.length).to.equal(0);
            expect(createdFilter.updatedAt.toISOString()).to.be.a('string');
            expect(createdFilter.vendors.length).to.equal(0);
          });
        });
      });
    });

    describe('And valid user business permissions get request', () => {
      context('When getting user business permissions', () => {
        it.only('Then return user business permissions', async () => {
          const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const userId = await getUserId();
          const request = {
            businessId,
            userId
          };
          console.log('userId: ' + userId);
          const permissions = await channelApeClient.businesses().getUserBusinessPermissions(request);
          console.log('permissions: ' + JSON.stringify(permissions));
          expect(permissions.businessId).to.equal(businessId);
          expect(permissions.userId).to.equal(userId);
          expect(permissions.owner).to.be.a('boolean');
        });
      });
    });

    async function getUserId(): Promise<string> {
      const session = await channelApeClient.sessions().get(sessionId);
      return session.userId;
    }
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
        + `${JSON.stringify(expectedChannelApeErrors)}, actual: ${JSON.stringify(actualChannelApeErrors)}`);

      expectedChannelApeErrors
        .sort((leftChannelApeError, rightChannelApeError) => leftChannelApeError.code - rightChannelApeError.code);
      actualChannelApeErrors
        .sort((leftChannelApeError, rightChannelApeError) => leftChannelApeError.code - rightChannelApeError.code);

      expectedChannelApeErrors.forEach((expectedChannelApeError, index) => {
        const actualChannelApeError = actualChannelApeErrors[index];
        expect(actualChannelApeError.code).to.equal(expectedChannelApeError.code,
          `Unexpected code for ChannelApeError at index ${index}`);
        expect(actualChannelApeError.message).to.equal(expectedChannelApeError.message,
          `Unexpected message for ChannelApeError at index ${index}`);
      });

    } else if (expectedChannelApeErrors.length > 0) {
      expect(Array.isArray(actualChannelApeErrors)).to.equal(true, 'actualChannelApeErrors should be array');
    }

  }

  function assertChannelEuropaSportsSnackFoods(channel: Channel) {
    expect(channel.additionalFields.length).to.equal(0);
    expect(channel.id).to.equal('9c728601-0286-457d-b0d6-ec19292d4485');
    expect(channel.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
    expect(channel.enabled).to.equal(true);
    expect(channel.integrationId).to.equal('02df0b31-a071-4791-b9c2-aa01e4fb0ce6');
    expect(channel.name).to.equal('EuropaSports Snacks / Foods');
    expect(channel.settings.allowCreate).to.equal(false);
    expect(channel.settings.allowRead).to.equal(true);
    expect(channel.settings.allowUpdate).to.equal(false);
    expect(channel.settings.allowDelete).to.equal(false);
    expect(channel.settings.disableVariants).to.equal(false);
    expect(channel.settings.priceType).to.equal('retail');
    expect(channel.settings.updateFields).to.have.same.members([
      'images',
      'inventoryQuantity',
      'vendor',
      'price',
      'weight',
      'description',
      'title',
      'tags'
    ]);
    expect(channel.settings.outputFile!.columns).to.be.an('array');
    expect(channel.settings.outputFile!.columns.length).to.equal(0);
    expect(channel.settings.outputFile!.header).to.be.true;
    const expectedCreatedAt = new Date('2018-02-22T16:04:29.030Z');
    expect(channel.createdAt.toISOString()).to.equal(expectedCreatedAt.toISOString());
    expect(channel.updatedAt.getUTCMilliseconds())
      .to.be.greaterThan(expectedCreatedAt.getUTCMilliseconds());
  }

  function assertSupplierEuropaSportsSnackFoods(supplier: Supplier) {
    expect(supplier.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
    expect(supplier.enabled).to.equal(true);
    expect(supplier.fileSettings!.additionalFieldsMapping[0].columnIndex).to.equal(55);
    expect(supplier.fileSettings!.additionalFieldsMapping[1].sourceId).to.equal('products');
    expect(supplier.fileSettings!.descriptionMapping[0].columnIndex).to.equal(7);
    expect(supplier.fileSettings!.descriptionMapping[1].prefix)
      .to.equal('<div class="directions">Directions</div><p>');
    expect(supplier.fileSettings!.imagesMapping[0].columnIndex).to.equal(49);
    expect(supplier.fileSettings!.optionsMapping[0].key).to.equal('Flavor');
    expect(supplier.fileSettings!.optionsMapping[0].columnIndex).to.equal(11);
    expect(supplier.fileSettings!.primaryCategoryMapping.columnIndex).to.equal(16);
    expect(supplier.fileSettings!.productMapping.columnIndex).to.equal(2);
    expect(supplier.fileSettings!.retailPriceMapping.columnIndex).to.equal(19);
    expect(supplier.fileSettings!.retailPriceMapping.currencyCode).to.equal('USD');
    expect(supplier.fileSettings!.sources[0].id).to.equal('products');
    expect(supplier.fileSettings!.sources[0].fileType).to.equal('CSV');
    expect(supplier.fileSettings!.sources[0].joinIndex).to.equal(0);
    expect(supplier.fileSettings!.sources[0].headers).to.equal(true);
    expect(supplier.fileSettings!.sources[0].authorization!.passwordKey).to.equal('password');
    expect(supplier.fileSettings!.sources[1].id).to.equal('nutrients');
    expect(supplier.fileSettings!.weightMapping.unitOfMeasurement).to.equal('g');
    expect(supplier.id).to.equal('1e4ebaa6-9796-4ccf-bd73-8765893a66bd');
    expect(supplier.integrationId).to.equal('2eacfed0-46ce-46b5-b8c6-dd8e29672c8c');
    expect(supplier.name).to.equal('Europa Sports');
  }
});
