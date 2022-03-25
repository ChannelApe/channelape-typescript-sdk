import { expect } from 'chai';
import { LogLevel } from 'channelape-logger';
import * as faker from 'faker';

import ChannelApeError from '../src/model/ChannelApeError';
import ChannelApeApiError from '../src/model/ChannelApeApiError';
import ChannelApeClient from '../src/ChannelApeClient';
import OrderStatus from '../src/orders/model/OrderStatus';
import OrdersQueryRequestByBusinessId from '../src/orders/model/OrdersQueryRequestByBusinessId';
import OrdersQueryRequestByPurchaseOrderNumber from '../src/orders/model/OrdersQueryRequestByPurchaseOrderNumber';
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
import InventoryItemCreateRequest from './../src/inventories/model/InventoryItemCreateRequest';
import InventoryItemUpdateRequest from './../src/inventories/model/InventoryItemUpdateRequest';
import LocationCreateRequest from './../src/locations/model/LocationCreateRequest';
import LocationUpdateRequest from './../src/locations/model/LocationUpdateRequest';
import AdjustmentRequest from './../src/inventories/quantities/model/AdjustmentRequest';
import { InventoryStatus } from '../src/inventories/enum/InventoryStatus';
import AdjustmentsBySku from '../src/inventories/quantities/model/AdjustmentsBySku';
import Step from '../src/steps/model/Step';
import StepVersion from '../src/suppliers/model/StepVersion';
import SupplierUpdateRequest from '../src/suppliers/model/SupplierUpdateRequest';

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
        }).timeout(40000);
      });
    });

    describe('And valid supplier', () => {
      context('When updating a supplier', () => {
        it('Then return the supplier', () => {
          const supplierUpdate = {
            id: 'b8205acd-4bdd-4153-9282-88f4570192d4',
            businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
            enabled: true,
            integrationId: 'dea1fe11-81ad-4b1f-90ca-18a099a5186f',
            name: 'E2E Test Supplier',
            stepSettings: {
              environmentVariables: [
                {
                  name: 'CHANNEL_APE_SECRET_KEY'
                },
                {
                  name: 'TEST_VARIABLE',
                  value: new Date().toISOString()
                }
              ],
              maximumConcurrentConnections: '5',
              orderQueryParameters: {
                channelIds: [],
                purchasedAtMaxIntervalMinutes: '0',
                purchasedAtMinIntervalMinutes: '1440',
                status: OrderStatus.OPEN,
                statuses: []
              },
              stepId: 'e3d1046f-a878-4d42-b675-0c215a406075',
              version: StepVersion.TEST
            }
          };
          const actualSuppliersPromise = channelApeClient.suppliers().update(supplierUpdate);
          return actualSuppliersPromise.then((supplier) => {
            assertSupplierUpdate(supplier, supplierUpdate);
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
            // @ts-ignore
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
          const expectedPurchaseOrderNumber = Math.random().toString();
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
            purchaseOrderNumber: expectedPurchaseOrderNumber,
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
            expect(createdOrder.purchaseOrderNumber).to.equal(expectedPurchaseOrderNumber);
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

      describe('And valid business ID', () => {
        describe('And an updatedStartDate of "2018-03-29T17:00:51.000Z" and an updatedEndDate of "2018-08-23T12:41:33.000Z"', () => {
          context('When retrieving orders', () => {
            it('Then return the 273 orders between those dates', () => {
              const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
              const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
                businessId: expectedBusinessId,
                updatedAtStartDate: new Date('2018-03-29T17:00:51.000Z'),
                updatedAtEndDate: new Date('2018-08-23T12:41:33.000Z')
              };
              const actualOrdersPromise = channelApeClient.orders().get(ordersQueryRequestByBusinessId);
              return actualOrdersPromise.then((actualOrders) => {
                expect(actualOrders).to.be.an('array');
                expect(actualOrders.length).to.equal(273);
                expect(actualOrders[0].id).to.equal('7f68efb0-3143-4bed-9944-27fe933326a2');
              });
            }).timeout(60000);
          });
        });

        describe('And a valid purchase order number', () => {
          context('When retrieving orders', () => {
            it('Then expect 1 matching order to be returned', () => {
              const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
              const ordersQueryRequestByBusinessId: OrdersQueryRequestByPurchaseOrderNumber = {
                businessId: expectedBusinessId,
                purchaseOrderNumber: '0.3354796505578477'
              };
              const actualOrdersPromise = channelApeClient.orders().get(ordersQueryRequestByBusinessId);
              return actualOrdersPromise.then((actualOrders) => {
                expect(actualOrders).to.be.an('array');
                expect(actualOrders.length).to.equal(1);
                expect(actualOrders[0].id).to.equal('36d00c15-a2a8-43d3-8c4c-f62bba7ade53');
                expect(actualOrders[0].purchaseOrderNumber)
                  .to.equal(ordersQueryRequestByBusinessId.purchaseOrderNumber);
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
              it('Then return the last single page of 74 orders for the business', () => {
                const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
                const ordersQueryRequestByBusinessId: OrdersQueryRequestByBusinessId = {
                  businessId: expectedBusinessId,
                  lastKey: '1f557ede-3df5-4335-a64b-cb4181943965',
                  size: 150
                };
                const actualOrdersPromise = channelApeClient.orders().getPage(ordersQueryRequestByBusinessId);
                return actualOrdersPromise.then((actualOrders) => {
                  expect(actualOrders.orders).to.be.an('array');
                  expect(actualOrders.orders.length).to.equal(74);
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

        describe('and locations exist', () => {
          context('When retrieving locations', () => {
            it('Then return the locations', async () => {
              const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
              const actualLocations = await channelApeClient.locations().getByBusinessId(expectedBusinessId);
              expect(actualLocations.length).to.be.greaterThan(0);

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
          it('And not using exact match with single result Then return variant quick search results', () => {
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

          it('And using exact match with multiple variants Then return matching variant quick search variant', () => {
            const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const expectedSku = 'BH300136';
            const variantsRequest: VariantsSearchRequestBySku = {
              sku: expectedSku,
              businessId: expectedBusinessId,
              exactMatch: true,
              size: 20
            };
            const actualVariantsPromise = channelApeClient.variants().search(variantsRequest);
            return actualVariantsPromise.then((actualVariants) => {
              expect(actualVariants).to.be.an('array');
              expect(actualVariants.length).to.equals(1);
              const variant = actualVariants[0];
              expect(variant!.businessId).to.equal(expectedBusinessId);
              expect(variant!.sku).to.equal(expectedSku);
              expect(variant!.title).to.equal('Eldridge Plaid Coat');
            });
          });

          it('And not using exact match with multiple results Then return variant quick search variant results', () => {
            const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const expectedSku = 'BH300136';
            const variantsRequest: VariantsSearchRequestBySku = {
              sku: expectedSku,
              businessId: expectedBusinessId
            };
            const actualVariantsPromise = channelApeClient.variants().search(variantsRequest);
            return actualVariantsPromise.then((actualVariants) => {
              expect(actualVariants).to.be.an('array');
              expect(actualVariants.length).to.be.greaterThan(1);
              const variant = actualVariants[0];
              expect(variant!.businessId).to.equal(expectedBusinessId);
              expect(variant!.sku).to.equal('BH300136-SAGE-L');
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

        context('When searching inventory items', () => {
          it('Then return inventory item results', async () => {
            const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const expectedSku = 'ZZZZ-123';

            const actualInventoryItems = await channelApeClient.inventories().get(expectedBusinessId, expectedSku);
            expect(actualInventoryItems.length).to.equal(1);
            expect(actualInventoryItems[0].businessId).to.equal(expectedBusinessId);
            expect(actualInventoryItems[0].id).to.equal('30');
            expect(actualInventoryItems[0].sku).to.equal(expectedSku);
            expect(actualInventoryItems[0].title).to.equal('Emmett Brown\'s Time Traveling Shoes - Mcfly 88\'s');
            expect(actualInventoryItems[0].createdAt.toString())
              .to.equal(new Date('2019-11-20T13:46:20.000Z').toString());
            expect(actualInventoryItems[0].updatedAt).to.not.be.undefined;
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
              expect(actualSubscription.apiRateLimitPerSecond).to.be.a('number');
              expect(actualSubscription.userRateLimitPerSecond).to.be.a('number');
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

      describe('And valid business member get request', () => {
        context('When getting business member', () => {
          it('Then return business member', async () => {
            const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const userId = 'd87e6d12-d7c2-47f7-a7c6-a16b6fcb82f1';
            const request = {
              businessId,
              userId
            };
            const member = await channelApeClient.businesses().getBusinessMember(request);
            expect(member.businessId).to.equal(businessId);
            expect(member.userId).to.equal(userId);
            expect(member.owner).to.equal(true);
          });
        });
      });

      describe('And valid inventory item id', () => {
        context('When getting inventory item', () => {
          it('Then return inventory item', async () => {
            const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';

            const inventoryItem = await channelApeClient.inventories().get('30');
            expect(inventoryItem.businessId).to.equal(businessId);
            expect(inventoryItem.createdAt).to.equal('2019-11-20T13:46:20.000Z');
            expect(inventoryItem.updatedAt).to.not.be.undefined;
            expect(inventoryItem.sku).to.equal('ZZZZ-123');
            expect(inventoryItem.id).to.equal('30');
            expect(inventoryItem.title).to.equal('Emmett Brown\'s Time Traveling Shoes - Mcfly 88\'s');
          });
        });
      });

      describe('And valid inventory item creation request', () => {
        context('When creating inventory item', () => {
          it('Then create and return inventory item', async () => {
            const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const generatedSku = `ABC-${Math.floor((Math.random() * 100000) + 1).toString()}`;
            const generatedTitle = `Some Testing title ${generatedSku}`;
            const inventoryItemCreationRequest: InventoryItemCreateRequest = {
              businessId,
              sku: generatedSku,
              title: generatedTitle
            };
            const inventoryItem = await channelApeClient.inventories().create(inventoryItemCreationRequest);
            expect(inventoryItem.businessId).to.equal(businessId);
            expect(inventoryItem.createdAt).to.not.be.undefined;
            expect(inventoryItem.updatedAt).to.not.be.undefined;
            expect(inventoryItem.sku).to.equal(generatedSku);
            expect(inventoryItem.id).to.not.be.undefined;
            expect(inventoryItem.title).to.equal(generatedTitle);
          });
        });
      });

      describe('And valid inventory item update request', () => {
        context('When update inventory item', () => {
          it('Then update and return inventory item', async () => {
            const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const generatedSku = `ABC-${Math.floor((Math.random() * 100000) + 1).toString()}`;
            const generatedTitle = `Some Testing title ${generatedSku}`;
            const inventoryItemUpdateRequest: InventoryItemUpdateRequest = {
              id: '33',
              sku: generatedSku,
              title: generatedTitle
            };
            const inventoryItem = await channelApeClient.inventories().update(inventoryItemUpdateRequest);
            expect(inventoryItem.businessId).to.equal(businessId);
            expect(inventoryItem.createdAt).to.not.be.undefined;
            expect(inventoryItem.updatedAt).to.not.be.undefined;
            expect(inventoryItem.sku).to.equal(generatedSku);
            expect(inventoryItem.id).to.not.be.undefined;
            expect(inventoryItem.title).to.equal(generatedTitle);
          });
        });
      });

      describe('And valid location id', () => {
        context('When getting location', () => {
          it('Then return location', async () => {
            const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';

            const location = await channelApeClient.locations().get('26');
            expect(location.businessId).to.equal(businessId);
            expect(location.createdAt).to.not.be.undefined;
            expect(location.updatedAt).to.not.be.undefined;
            expect(location.name).to.equal('Some-Location-66276');

          });
        });
      });

      describe('And valid location creation request', () => {
        context('When creating location', () => {
          it('Then create and return location', async () => {
            const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const generatedName = `Some-Location-${new Date().getTime().toString()}`;
            const locationCreateRequest: LocationCreateRequest = {
              businessId,
              name: generatedName
            };
            const location = await channelApeClient.locations().create(locationCreateRequest);
            expect(location.businessId).to.equal(businessId);
            expect(location.createdAt).to.not.be.undefined;
            expect(location.updatedAt).to.not.be.undefined;
            expect(location.name).to.equal(generatedName);
            expect(location.id).to.not.be.undefined;
          });
        });
      });

      describe('And valid location update request', () => {
        context('When update location', () => {
          it('Then update and return location', async () => {
            const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
            const generatedName = `Some-Location-${Math.floor((Math.random() * 100000) + 1).toString()}`;
            const locationUpdateRequest: LocationUpdateRequest = {
              id: '28',
              name: generatedName
            };
            const location = await channelApeClient.locations().update(locationUpdateRequest);
            expect(location.businessId).to.equal(businessId);
            expect(location.createdAt).to.not.be.undefined;
            expect(location.updatedAt).to.not.be.undefined;
            expect(location.name).to.equal(generatedName);
            expect(location.id).to.equal(locationUpdateRequest.id);
          });
        });
      });

      describe('And valid adjustment request', () => {
        context('When adjusting quantities', () => {
          it('Then update and return quantities', async () => {
            const inventoryItemId = '34';
            const locationId = '28';
            const quantity = -148;
            const inventoryStatus = InventoryStatus.AVAILABLE_TO_SELL;
            const idempotentKey = `${new Date().toISOString()}_${locationId}_${inventoryItemId}_${inventoryStatus}`;
            const adjustmentRequest: AdjustmentRequest = {
              inventoryItemId,
              locationId,
              quantity,
              inventoryStatus,
              idempotentKey
            };
            const actualAdjustment = await channelApeClient.inventories().quantities().adjust(adjustmentRequest);
            expect(actualAdjustment.inventoryItemId).to.equal(inventoryItemId);
            expect(actualAdjustment.createdAt).to.not.be.undefined;
            expect(actualAdjustment.updatedAt).to.not.be.undefined;
            expect(actualAdjustment.locationId).to.equal(locationId);
            expect(actualAdjustment.inventoryStatus).to.equal(adjustmentRequest.inventoryStatus);
          });
        });

        context('When setting quantities', () => {
          it('Then update and return quantities', async () => {
            const inventoryItemId = '33';
            const locationId = '28';
            const quantity = 29;
            const inventoryStatus = InventoryStatus.ON_ORDER;
            const adjustmentRequest: AdjustmentRequest = {
              inventoryItemId,
              locationId,
              quantity,
              inventoryStatus
            };
            const actualAdjustment = await channelApeClient.inventories().quantities().set(adjustmentRequest);
            expect(actualAdjustment.inventoryItemId).to.equal(inventoryItemId);
            expect(actualAdjustment.createdAt).to.not.be.undefined;
            expect(actualAdjustment.updatedAt).to.not.be.undefined;
            expect(actualAdjustment.locationId).to.equal(locationId);
            expect(actualAdjustment.inventoryStatus).to.equal(adjustmentRequest.inventoryStatus);
          });
        });
      });

      describe('And valid batch adjustment request', () => {
        context('When adjusting quantities', () => {
          it('Then update', async () => {
            const currentDateTime = new Date().toISOString();
            const adjustmentsBySku: AdjustmentsBySku[] = [{
              sku: 'A1',
              adjustments: [{
                quantity: 1,
                inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }, {
                quantity: 3,
                inventoryStatus: InventoryStatus.ON_HOLD,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }]
            }, {
              sku: 'B1',
              adjustments: [{
                quantity: 2,
                inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }, {
                quantity: 0,
                inventoryStatus: InventoryStatus.ON_HOLD,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }]
            }];
            await channelApeClient.inventories().quantities().setBatch(adjustmentsBySku);
          });
        });

        context('When setting quantities', () => {
          it('Then update', async () => {
            const currentDateTime = new Date().toISOString();
            const adjustmentsBySku: AdjustmentsBySku[] = [{
              sku: 'A1',
              adjustments: [{
                quantity: 1,
                inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }, {
                quantity: 3,
                inventoryStatus: InventoryStatus.ON_HOLD,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }]
            }, {
              sku: 'B1',
              adjustments: [{
                quantity: 2,
                inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }, {
                quantity: 0,
                inventoryStatus: InventoryStatus.ON_HOLD,
                deduplicationKey: currentDateTime,
                locationId: '28'
              }]
            }];
            await channelApeClient.inventories().quantities().setBatch(adjustmentsBySku);
          });
        });

      });

      describe('And valid inventory item id', () => {
        context('When retrieving inventory quantities', () => {
          it('Then return inventory quantities', async () => {

            const quantities = await channelApeClient.inventories().quantities().retrieve('35');
            expect(quantities.length).to.be.greaterThan(0);
          });
        });
      });

      describe('And valid step ID', () => {
        context('When retrieving step', () => {
          it('Then return step', () => {
            const expectedStepId = 'e3d1046f-a878-4d42-b675-0c215a406075';
            const actualStepPromise = channelApeClient.steps().get(expectedStepId);
            return actualStepPromise.then(assertStep);
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

    function assertStep(actualStep: Step) {
      expect(actualStep.id).to.deep.equal('e3d1046f-a878-4d42-b675-0c215a406075');
      expect(actualStep.name).to.deep.equal('E2E Test Step');
    }

    function assertSupplierUpdate(actualSupplier: Supplier, updateRequest: SupplierUpdateRequest) {
      expect(actualSupplier.id).to.equal(updateRequest.id);
      expect(actualSupplier.name).to.equal(updateRequest.name);
      expect(actualSupplier.enabled).to.equal(updateRequest.enabled);
      expect(actualSupplier.integrationId).to.equal(updateRequest.integrationId);
      expect(actualSupplier.stepSettings).to.deep.equal(updateRequest.stepSettings);
    }
  });
});
