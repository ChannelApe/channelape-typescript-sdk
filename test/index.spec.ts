import * as ChannelApe from '../src/index';
import { expect } from 'chai';

describe('Index', () => {
  it('Expect ChannelApeClient to be exported', () => {
    expect(ChannelApe.ChannelApeClient).to.equal(ChannelApe.ChannelApeClient);
  });

  it('Expect ClientConfiguration to be exported', () => {
    const clientConfiguration: ChannelApe.ClientConfiguration = {
      sessionId: 'sessionId'
    };
    expect(clientConfiguration.sessionId).to.equal('sessionId');
  });

  it('Expect LogLevel to be exported', () => {
    expect(ChannelApe.LogLevel).to.equal(ChannelApe.LogLevel);
  });

  it('Expect Environment to be exported', () => {
    expect(ChannelApe.Environment).to.equal(ChannelApe.Environment);
  });

  it('Expect Action to be exported', () => {
    const action: ChannelApe.Action = {
      action: 'actionId',
      businessId: 'businessId',
      description: 'desc',
      healthCheckIntervalInSeconds: 3000,
      id: 'id',
      lastHealthCheckTime: new Date(),
      processingStatus: 'IN_PROGRESS',
      startTime: new Date(),
      targetId: 'targetId',
      targetType: 'channel'
    };
    expect(action.id).to.equal('id');
  });

  it('Expect Channel to be exported', () => {
    const channel: ChannelApe.Channel = {
      businessId: 'businessId',
      id: 'id',
      createdAt: new Date(),
      enabled: true,
      integrationId: 'intId',
      name: 'name',
      settings: {
        allowCreate: true,
        allowDelete: true,
        allowRead: true,
        allowUpdate: true,
        disableVariants: true,
        priceType: 'USD',
        updateFields: []
      },
      updatedAt: new Date
    };
    expect(channel.id).to.equal('id');
  });

  it('Expect ChannelSettings to be exported', () => {
    const channelSettings: ChannelApe.ChannelSettings = {
      allowCreate: true,
      allowDelete: true,
      allowRead: true,
      allowUpdate: true,
      disableVariants: true,
      priceType: 'USD',
      updateFields: []
    };
    expect(channelSettings.allowCreate).to.equal(true);
  });

  it('Expect Address to be exported', () => {
    const address: ChannelApe.Address = {
      additionalFields: [],
      address1: 'addr1',
      address2: 'addr2',
      city: 'city',
      country: 'country',
      countryCode: 'countryCode',
      firstName: 'fname',
      lastName: 'lname',
      name: 'fname lname',
      postalCode: 'postal code',
      province: 'province',
      provinceCode: 'provinceCode'
    };
    expect(address.address1).to.equal('addr1');
  });

  it('Expect Customer to be exported', () => {
    const customer: ChannelApe.Customer = {
      additionalFields: [],
      billingAddress: {
        additionalFields: [],
        address1: 'addr1',
        address2: 'addr2',
        city: 'city',
        country: 'country',
        countryCode: 'countryCode',
        firstName: 'fname',
        lastName: 'lname',
        name: 'fname lname',
        postalCode: 'postal code',
        province: 'province',
        provinceCode: 'provinceCode'
      },
      email: 'email',
      firstName: 'fname',
      lastName: 'lname',
      name: 'fname lname',
      shippingAddress: {
        additionalFields: [],
        address1: 'addr1',
        address2: 'addr2',
        city: 'city',
        country: 'country',
        countryCode: 'countryCode',
        firstName: 'fname',
        lastName: 'lname',
        name: 'fname lname',
        postalCode: 'postal code',
        province: 'province',
        provinceCode: 'provinceCode'
      }
    };
    expect(customer.name).to.equal('fname lname');
  });

  it('Expect Fulfillment to be exported', () => {
    const fulfillment: ChannelApe.Fulfillment = {
      additionalFields: [],
      id: 'id',
      lineItems: [],
      status: ChannelApe.FulfillmentStatus.CLOSED
    };
    expect(fulfillment.id).to.equal('id');
  });

  it('Expect FulfillmentStatus to be exported', () => {
    expect(ChannelApe.FulfillmentStatus).to.equal(ChannelApe.FulfillmentStatus);
  });

  it('Expect LineItem to be exported', () => {
    const lineItem: ChannelApe.LineItem = {
      additionalFields: [],
      grams: 1,
      id: 'id',
      price: 100.44,
      quantity: 3,
      shippingMethod: 'some shipping method',
      sku: 'abc-123',
      title: 'Stuffed Ape',
      vendor: 'CA Brands'
    };
    expect(lineItem.sku).to.equal('abc-123');
  });

  it('Expect OrdersRequestByBusinessId to be exported', () => {
    const ordersRequestByBusinessId: ChannelApe.OrdersRequestByBusinessId = {
      businessId: 'businessId',
      endDate: new Date(),
      lastKey: 'some last key',
      size: 100,
      startDate: new Date(),
      status: ChannelApe.OrderStatus.OPEN
    };
    expect(ordersRequestByBusinessId.businessId).to.equal('businessId');
  });

  it('Expect OrdersRequestByChannel to be exported', () => {
    const ordersRequestByChannel: ChannelApe.OrdersRequestByChannel = {
      channelId: 'channelId',
      endDate: new Date(),
      lastKey: 'some last key',
      size: 100,
      startDate: new Date(),
      status: ChannelApe.OrderStatus.OPEN
    };
    expect(ordersRequestByChannel.channelId).to.equal('channelId');
  });

  it('Expect OrdersRequestByChannelOrderId to be exported', () => {
    const ordersRequestByChannelOrderId: ChannelApe.OrdersRequestByChannelOrderId = {
      businessId: 'businessId',
      channelOrderId: 'channelOrderId',
      endDate: new Date(),
      lastKey: 'some last key',
      size: 100,
      startDate: new Date(),
      status: ChannelApe.OrderStatus.OPEN
    };
    expect(ordersRequestByChannelOrderId.channelOrderId).to.equal('channelOrderId');
  });

  it('Expect OrderStatus to be exported', () => {
    expect(ChannelApe.OrderStatus).to.equal(ChannelApe.OrderStatus);
  });

  it('Expect Order to be exported', () => {
    const order: ChannelApe.Order = {
      additionalFields: [
        {
          name: 'closed_at',
          value: 'null'
        }],
      alphabeticCurrencyCode: 'USD',
      businessId: '4d688534-d82e-4111-940c-322ba9aec108',
      channelId: '0d134d16-ad7e-4724-841e-7d46e0f128bd',
      channelOrderId: '314980073478',
      createdAt: new Date('2018-05-03T18:07:58.009Z'),
      customer: {
        additionalFields: [
          {
            name: 'id',
            value: '289747828742'
          }],
        billingAddress: {
          additionalFields: [],
          address1: '04822 Stracke Shores',
          city: 'South Deanhaven',
          country: 'United States',
          countryCode: 'US',
          firstName: 'Rebekah',
          lastName: 'Little',
          name: 'Rebekah Little',
          postalCode: '66493',
          province: 'Kansas',
          provinceCode: 'KS'
        },
        email: 'Aurore.Purdy17@gmail.com',
        firstName: 'Rebekah',
        lastName: 'Little',
        shippingAddress: {
          additionalFields: [],
          address1: '04822 Stracke Shores',
          city: 'South Deanhaven',
          country: 'United States',
          countryCode: 'US',
          firstName: 'Rebekah',
          lastName: 'Little',
          name: 'Rebekah Little',
          postalCode: '66493',
          province: 'Kansas',
          provinceCode: 'KS'
        }
      },
      errors: [],
      fulfillments: [],
      id: 'c0f45529-cbed-4e90-9a38-c208d409ef2a',
      lineItems: [
        {
          additionalFields: [
            {
              name: 'variant_id',
              value: '36581474886'
            },
            {
              name: 'title',
              value: 'Generic Steel Shirt'
            },
            {
              name: 'variant_title',
              value: 'Generic Steel Shirt'
            },
            {
              name: 'product_id',
              value: '9670311622'
            },
            {
              name: 'requires_shipping',
              value: 'true'
            },
            {
              name: 'taxable',
              value: 'true'
            },
            {
              name: 'gift_card',
              value: 'false'
            },
            {
              name: 'variant_inventory_management',
              value: 'shopify'
            },
            {
              name: 'fulfillable_quantity',
              value: '1'
            },
            {
              name: 'total_discount',
              value: '0.00'
            },
            {
              name: 'fulfillment_service',
              value: 'manual'
            }
          ],
          grams: 371,
          id: '646495567878',
          price: 12.99,
          quantity: 1,
          shippingMethod: 'Standard',
          sku: 'e67f1d90-824a-4941-8497-08d632763c93',
          title: 'Generic Steel Shirt',
          vendor: 'Ankunding - Corwin'
        }
      ],
      purchasedAt: new Date('2018-03-29T19:06:26.000Z'),
      status: ChannelApe.OrderStatus.OPEN,
      subtotalPrice: 25.98,
      totalGrams: 74,
      totalPrice: 31.93,
      totalShippingPrice: 5.95,
      totalTax: 0.00,
      updatedAt: new Date('2018-05-03T18:07:58.009Z')
    };
    expect(order.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a');
  });

});
