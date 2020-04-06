import Order from '../../../src/orders/model/Order';
import OrderStatus from '../../../src/orders/model/OrderStatus';

const multipleOrdersStatus: Order[] = [
  {
    additionalFields: [
      {
        name: 'closed_at',
        value: 'null'
      },
      {
        name: 'number',
        value: '1161251'
      },
      {
        name: 'token',
        value: '5d89:d8e9:291d:d91c:f106:74c9:d161:0bf3'
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
        value: '25.98'
      },
      {
        name: 'cart_token',
        value: 'e554f7db08b90d0cfd365d82363ad4a2'
      },
      {
        name: 'buyer_accepts_marketing',
        value: 'true'
      },
      {
        name: 'name',
        value: '#G1162251'
      },
      {
        name: 'referring_site',
        value: 'susanna.biz'
      },
      {
        name: 'landing_site',
        value: 'kariane.com'
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
        value: '38.134.125.90'
      },
      {
        name: 'order_number',
        value: '1162251'
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
        name: 'order_status_url',
        value: 'estella.biz'
      },
      {
        name: 'updated_at',
        value: '2018-03-29T13:06:31.000-06:00'
      },
      {
        name: 'note_attributes_OrderType',
        value: 'vel'
      },
      {
        name: 'risk_recommendation',
        value: 'accept'
      },
      {
        name: 'risk_message',
        value: 'Billing placed Shopify recommendation'
      },
      {
        name: 'risk_merchant_message',
        value: 'Billing was placed Shopify recommendation'
      }
    ],
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
        },
        {
          name: 'accepts_marketing',
          value: 'true'
        },
        {
          name: 'orders_count',
          value: '1'
        },
        {
          name: 'total_spent',
          value: '31.93'
        },
        {
          name: 'state',
          value: 'disabled'
        }
      ],
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
      },
      {
        additionalFields: [
          {
            name: 'variant_id',
            value: '42852035782'
          },
          {
            name: 'title',
            value: 'Tasty Steel Bacon'
          },
          {
            name: 'product_id',
            value: '10590339974'
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
        grams: 369,
        id: '646495600646',
        price: 12.99,
        quantity: 1,
        shippingMethod: 'Standard',
        sku: '27464759-a723-47bf-8d31-332cec285ead',
        title: 'Tasty Steel Bacon',
        vendor: 'Hand, Swift and Langosh'
      }
    ],
    purchasedAt: new Date('2018-03-29T19:06:26.000Z'),
    status: OrderStatus.OPEN,
    subtotalPrice: 25.98,
    totalGrams: 74,
    totalPrice: 31.93,
    totalShippingPrice: 5.95,
    totalTax: 0.00,
    updatedAt: new Date('2018-05-03T18:07:58.009Z')
  },
  {
    additionalFields: [
      {
        name: 'closed_at',
        value: 'null'
      },
      {
        name: 'number',
        value: '1161250'
      },
      {
        name: 'token',
        value: '23dc:32cf:bd72:f426:e3ba:e211:f4e8:3e45'
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
        value: '61.99'
      },
      {
        name: 'cart_token',
        value: 'ad41501e03fbc828fd4682e2a731dc51'
      },
      {
        name: 'buyer_accepts_marketing',
        value: 'true'
      },
      {
        name: 'name',
        value: '#G1162250'
      },
      {
        name: 'landing_site',
        value: 'brenna.biz'
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
        value: '73.221.88.5'
      },
      {
        name: 'order_number',
        value: '1162250'
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
        name: 'order_status_url',
        value: 'nasir.org'
      },
      {
        name: 'updated_at',
        value: '2018-03-29T13:06:01.000-06:00'
      },
      {
        name: 'note_attributes_OrderType',
        value: 'ut'
      },
      {
        name: 'risk_recommendation',
        value: 'accept'
      },
      {
        name: 'risk_message',
        value: 'Billing ste order was placed Shopify recommendation'
      },
      {
        name: 'risk_merchant_message',
        value: 'Billing the order was placed Shopify recommendation'
      }
    ],
    alphabeticCurrencyCode: 'USD',
    businessId: '23aac9ff-d9f3-4b80-bf5a-8d438111a222',
    channelId: 'c815980f-2591-4be7-958c-0477c4cc6df5',
    channelOrderId: '314979713030',
    createdAt: new Date('2018-03-29T19:08:16.175Z'),
    customer: {
      additionalFields: [
        {
          name: 'id',
          value: '158657150982'
        },
        {
          name: 'accepts_marketing',
          value: 'true'
        },
        {
          name: 'orders_count',
          value: '3'
        },
        {
          name: 'total_spent',
          value: '185.85'
        },
        {
          name: 'state',
          value: 'disabled'
        }
      ],
      billingAddress: {
        additionalFields: [],
        address1: '54868 Labadie Row',
        city: 'West Dennisfort',
        country: 'United States',
        countryCode: 'US',
        firstName: 'Vincenzo',
        lastName: 'Fahey',
        name: 'Vincenzo Fahey',
        postalCode: '90037',
        provinceCode: 'OK',
        province: 'Illinois'
      },
      email: 'Marcia_Bahringer68@gmail.com',
      firstName: 'Vincenzo',
      lastName: 'Fahey',
      shippingAddress: {
        additionalFields: [],
        address1: '54868 Labadie Row',
        city: 'West Dennisfort',
        country: 'United States',
        countryCode: 'US',
        firstName: 'Vincenzo',
        lastName: 'Fahey',
        name: 'Vincenzo Fahey',
        postalCode: '90037',
        provinceCode: 'OK',
        province: 'Illinois'
      }
    },
    fulfillments: [],
    id: 'd3257ee3-c7ee-4beb-bbee-8d5d12f0c1f1',
    lineItems: [
      {
        additionalFields: [
          {
            name: 'variant_id',
            value: '41462222342'
          },
          {
            name: 'title',
            value: 'Small Steel Salad'
          },
          {
            name: 'variant_title',
            value: 'Small Steel Salad'
          },
          {
            name: 'product_id',
            value: '1285526275'
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
        id: '646494846982',
        price: 13.99,
        quantity: 1,
        shippingMethod: 'Standard',
        sku: 'f7a7674e-2469-4ef9-ad7c-597bd5493975',
        title: 'Small Steel Salad',
        vendor: 'Osinski, Gibson and Yost'
      },
      {
        additionalFields: [
          {
            name: 'variant_id',
            value: '41462821318'
          },
          {
            name: 'title',
            value: 'Small Granite Soap'
          },
          {
            name: 'variant_title',
            value: 'Small Granite Soap'
          },
          {
            name: 'product_id',
            value: '1284267907'
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
        grams: 1474,
        id: '646494879750',
        price: 48.00,
        quantity: 1,
        shippingMethod: 'Standard',
        sku: 'f57887b9-d113-4f64-921e-a938e17e41ec',
        title: 'Small Granite Soap',
        vendor: 'Farrell - Dach'
      }
    ],
    purchasedAt: new Date('2018-03-29T19:05:56.000Z'),
    status: OrderStatus.CLOSED,
    subtotalPrice: 61.99,
    totalGrams: 1846,
    totalPrice: 61.99,
    totalShippingPrice: 0.00,
    totalTax: 0.00,
    updatedAt: new Date('2018-03-29T19:08:16.175Z')
  },
  {
    additionalFields: [
      {
        name: 'closed_at',
        value: 'null'
      },
      {
        name: 'number',
        value: '1161250'
      },
      {
        name: 'token',
        value: '23dc:32cf:bd72:f426:e3ba:e211:f4e8:3e45'
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
        value: '61.99'
      },
      {
        name: 'cart_token',
        value: 'ad41501e03fbc828fd4682e2a731dc51'
      },
      {
        name: 'buyer_accepts_marketing',
        value: 'true'
      },
      {
        name: 'name',
        value: '#G1162250'
      },
      {
        name: 'landing_site',
        value: 'brenna.biz'
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
        value: '73.221.88.5'
      },
      {
        name: 'order_number',
        value: '1162250'
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
        name: 'order_status_url',
        value: 'nasir.org'
      },
      {
        name: 'updated_at',
        value: '2018-03-29T13:06:01.000-06:00'
      },
      {
        name: 'note_attributes_OrderType',
        value: 'ut'
      },
      {
        name: 'risk_recommendation',
        value: 'accept'
      },
      {
        name: 'risk_message',
        value: 'Billing ste order was placed Shopify recommendation'
      },
      {
        name: 'risk_merchant_message',
        value: 'Billing the order was placed Shopify recommendation'
      }
    ],
    alphabeticCurrencyCode: 'USD',
    businessId: '23aac9ff-d9f3-4b80-bf5a-8d438111a222',
    channelId: 'c815980f-2591-4be7-958c-0477c4cc6df5',
    channelOrderId: '314979713030',
    createdAt: new Date('2018-03-29T19:08:16.175Z'),
    customer: {
      additionalFields: [
        {
          name: 'id',
          value: '158657150982'
        },
        {
          name: 'accepts_marketing',
          value: 'true'
        },
        {
          name: 'orders_count',
          value: '3'
        },
        {
          name: 'total_spent',
          value: '185.85'
        },
        {
          name: 'state',
          value: 'disabled'
        }
      ],
      billingAddress: {
        additionalFields: [],
        address1: '54868 Labadie Row',
        city: 'West Dennisfort',
        country: 'United States',
        countryCode: 'US',
        firstName: 'Vincenzo',
        lastName: 'Fahey',
        name: 'Vincenzo Fahey',
        postalCode: '90037',
        provinceCode: 'OK',
        province: 'Illinois'
      },
      email: 'Marcia_Bahringer68@gmail.com',
      firstName: 'Vincenzo',
      lastName: 'Fahey',
      shippingAddress: {
        additionalFields: [],
        address1: '54868 Labadie Row',
        city: 'West Dennisfort',
        country: 'United States',
        countryCode: 'US',
        firstName: 'Vincenzo',
        lastName: 'Fahey',
        name: 'Vincenzo Fahey',
        postalCode: '90037',
        provinceCode: 'OK',
        province: 'Illinois'
      }
    },
    fulfillments: [],
    id: 'd3257ee3-c7ee-4beb-bbee-8d5d12f0c1f1',
    lineItems: [
      {
        additionalFields: [
          {
            name: 'variant_id',
            value: '41462222342'
          },
          {
            name: 'title',
            value: 'Small Steel Salad'
          },
          {
            name: 'variant_title',
            value: 'Small Steel Salad'
          },
          {
            name: 'product_id',
            value: '1285526275'
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
        id: '646494846982',
        price: 13.99,
        quantity: 1,
        shippingMethod: 'Standard',
        sku: 'f7a7674e-2469-4ef9-ad7c-597bd5493975',
        title: 'Small Steel Salad',
        vendor: 'Osinski, Gibson and Yost'
      },
      {
        additionalFields: [
          {
            name: 'variant_id',
            value: '41462821318'
          },
          {
            name: 'title',
            value: 'Small Granite Soap'
          },
          {
            name: 'variant_title',
            value: 'Small Granite Soap'
          },
          {
            name: 'product_id',
            value: '1284267907'
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
        grams: 1474,
        id: '646494879750',
        price: 48.00,
        quantity: 1,
        shippingMethod: 'Standard',
        sku: 'f57887b9-d113-4f64-921e-a938e17e41ec',
        title: 'Small Granite Soap',
        vendor: 'Farrell - Dach'
      }
    ],
    purchasedAt: new Date('2018-03-29T19:05:56.000Z'),
    status: OrderStatus.PENDING,
    subtotalPrice: 61.99,
    totalGrams: 1846,
    totalPrice: 61.99,
    totalShippingPrice: 0.00,
    totalTax: 0.00,
    updatedAt: new Date('2018-03-29T19:08:16.175Z')
  }
];

export default multipleOrdersStatus;
