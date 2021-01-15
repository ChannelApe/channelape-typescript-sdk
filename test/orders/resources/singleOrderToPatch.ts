import Order from '../../../src/orders/model/Order';
import OrderStatus from '../../../src/orders/model/OrderStatus';

const singleOrderToPatch: Partial<Order> = {
  additionalFields: [
    {
      name: 'note_attributes_order_type',
      value: 'CC'
    },
    {
      name: 'note_attributes_customerAccount',
      value: 'Rogue'
    },
    {
      name: 'closed_at',
      value: 'null'
    },
    {
      name: 'number',
      value: '572'
    },
    {
      name: 'number',
      value: '666'
    },
    {
      name: 'token',
      value: 'b9b9:1eaa:e69d:cac8:1a9a:ed6c:753d:764b'
    },
    {
      name: 'taxes_included',
      value: 'false'
    },
    {
      name: 'financial_status',
      value: 'paid'
    },
    {
      name: 'total_discounts',
      value: '0.00'
    },
    {
      name: 'total_line_items_price',
      value: '10.43'
    },
    {
      name: 'cart_token',
      value: '43feecf3fb62dd68b468e204f60e1b6a'
    },
    {
      name: 'buyer_accepts_marketing',
      value: 'false'
    },
    {
      name: 'name',
      value: 'InsB15728169'
    },
    {
      name: 'referring_site',
      value: 'darrick.net'
    },
    {
      name: 'landing_site',
      value: 'valentine.name'
    },
    {
      name: 'cancelled_at',
      value: 'null'
    },
    {
      name: 'user_id',
      value: 'null'
    },
    {
      name: 'location_id',
      value: 'null'
    },
    {
      name: 'browser_ip',
      value: '172.8.239.51'
    },
    {
      name: 'order_number',
      value: '1572'
    },
    {
      name: 'processing_method',
      value: 'direct'
    },
    {
      name: 'source_name',
      value: 'web'
    },
    {
      name: 'fulfillment_status',
      value: 'fulfilled'
    },
    {
      name: 'tags',
      value: 'InProcess'
    },
    {
      name: 'order_status_url',
      value: 'paris.com'
    },
    {
      name: 'risk_recommendation',
      value: 'accept'
    },
    {
      name: 'risk_message',
      value: 'Billing street address is correct'
    },
    {
      name: 'risk_merchant_message',
      value: 'Billing street address is correct'
    }
  ],
  alphabeticCurrencyCode: 'USD',
  businessId: '23aac9ff-d9f3-4b80-bf5a-8d438111a222',
  channelId: '0d134d16-ad7e-4724-841e-7d46e0f128bd',
  channelOrderId: '314980073478',
  createdAt: new Date('2018-05-03T18:07:58.009Z'),
  purchaseOrderNumber: '123456',
  customer: {
    additionalFields: [
      {
        name: 'id',
        value: '197323554842'
      },
      {
        name: 'accepts_marketing',
        value: 'false'
      },
      {
        name: 'orders_count',
        value: '1'
      },
      {
        name: 'total_spent',
        value: '14.42'
      },
      {
        name: 'state',
        value: 'disabled'
      }
    ],
    billingAddress: {
      additionalFields: [],
      address1: '93414 Kaci Tunnel',
      city: 'Gleichnerville',
      country: 'United States',
      countryCode: 'US',
      firstName: 'Axel',
      lastName: 'Herzog',
      name: 'Axel Herzog',
      postalCode: '15454-7009',
      provinceCode: 'PA',
      province: 'New Hampshire'
    },
    email: 'Damaris_Walsh88@hotmail.com',
    firstName: 'Axel',
    lastName: 'Herzog',
    shippingAddress: {
      additionalFields: [],
      address1: '93414 Kaci Tunnel',
      city: 'Gleichnerville',
      country: 'United States',
      countryCode: 'US',
      firstName: 'Axel',
      lastName: 'Herzog',
      name: 'Axel Herzog',
      postalCode: '15454-7009',
      provinceCode: 'PA',
      province: 'New Hampshire'
    }
  },
  fulfillments: [],
  refunds: [],
  id: 'c0f45529-cbed-4e90-9a38-c208d409ef2a',
  purchasedAt: new Date('2018-03-29T19:06:26.000Z'),
  status: OrderStatus.OPEN,
  subtotalPrice: 41.72,
  totalGrams: 476,
  totalPrice: 43.99,
  totalTax: 0.00,
  updatedAt: new Date('2018-05-03T18:07:58.009Z')
};

export default singleOrderToPatch;
