# ChannelApe SDK

TypeScript and JavaScript SDK for the [ChannelApe REST API](https://docs.channelape.io/)

[![Build Status](https://travis-ci.org/ChannelApe/channelape-typescript-sdk.svg?branch=master)](https://travis-ci.org/ChannelApe/channelape-typescript-sdk)  [![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&metric=coverage)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk)

## Features
- [Getting Started](#getting-started)
- [Sessions](#sessions)
- [Actions](#actions)
- [Channels](#channels)
- [Orders](#orders)
- [Variants](#variants)
- [Businesses](#businesses)
- [Subscriptions](#subscriptions)
- [Order Activities](#order-activities)

### Getting Started

The ChannelApe SDK is asynchronous and all functions return promises.

#### Creating a client

Create a new instance of the ChannelApeClient with your sessionId.

```typescript
const channelApeClient = new ChannelApeClient({
  sessionId: '4674b668-c4d2-4270-bf9b-ebaab78c378d'
});
```

#### Optional client configurations

* timeout - Number of milliseconds to wait for the API to send response headers. Defaults to 180000 (3 minutes). Cannot be set lower than 2000 (2 seconds).
* endpoint - Envrionment endpoint you would like to hit. Defaults to https://api.channelape.com
* logLevel - Level of logs you wish to see from the SDK. Defaults to OFF.
* maximumRequestRetryTimeout - Number of milliseconds to keep retrying a request for when an undesired response status code is received. Defaults to 180000 (3 minutes). Cannot be set lower than 2000 (2 seconds).
* minimumRequestRetryRandomDelay - Minimum number of milliseconds to randomly delay by when an undesired response status code is received. Defaults to 1000 (1 second). Cannot be set lower than 1000 (1 second).
* maximumRequestRetryRandomDelay - Maximum number of milliseconds to randomly delay by when an undesired response status code is received. Defaults to 5000 (5 seconds). Cannot be set lower than 2000 (2 seconds).

### Sessions

#### Get Session
A User Account session will include your `userId` which is useful when retrieving [Businesses](#Businesses). API Account sessions will return an `apiAccountId` instead.
```typescript
channelApeClient.sessions().get(sessionId)
  .then((session: Session) => {
    // do what you need to do with session data here
    // session will also include your userId or apiAccountId
  });
```

### Actions

#### Get action
```typescript
channelapeClient.actions().get(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

#### Complete action
```typescript
channelapeClient.actions().complete(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

#### Update action with error
```typescript
channelapeClient.actions().error(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

#### Update action health check
```typescript
channelapeClient.actions().updateHealthCheck(actionId)
  .then((action: Action) => {
    // do what you need to do with action data here
  });
```

### Channels

#### Get channel
```typescript
channelapeClient.channels().get(channelId)
  .then((channel: Channel) => {
    // do what you need to do with channel data here
  });
```

#### Get all channels for a business
```typescript
channelapeClient.channels().get({ businessId: 'some-valid-business-id' })
  .then((channels: Channel[]) => {
    // do what you need to do with channel data here
  });
```

### Orders

#### Get order
```typescript
channelapeClient.orders().get(orderId)
  .then((order: Order) => {
    // do what you need to do with order data here
  });
```

#### Update order
```typescript
channelapeClient.orders().update(order)
  .then((updatedOrder: Order) => {
    // do what you need to do with updatedOrder data here
  });
```

#### Patch order
```typescript
channelapeClient.orders().patch(order)
  .then((patchedOrder: Order) => {
    // do what you need to do with patchedOrder data here
  });
```

#### Create order
````typescript
const orderToCreate: OrderCreateRequest = {
  additionalFields: [
    { name: 'name', value: 'CA1001' },
    { name: 'order_number', value: '1001' }
  ],
  totalPrice: 295.99,
  alphabeticCurrencyCode: 'USD',
  channelId: 'your-channel-id',
  channelOrderId: 'specify-your-channel-order-id',
  customer: {
    firstName: 'John',
    lastName: 'Smith',
    name: 'John Smith',
    additionalFields: [
      { name: 'extraCustomerData', value: 'Put whatever you would like here' }
    ]
  },
  status: OrderStatus.OPEN,
  purchasedAt: new Date(),
  lineItems: [{
    id: 'some-line-item-id',
    quantity: 1,
    sku: 'NCC1701D',
    title: 'A model space ship',
    additionalFields: [
      { name: 'extraLineItemData', value: 'Put whatever you would like here' }
    ]
  }]
};
channelapeClient.orders().create(orderCreateRequest)
  .then((createdOrder: Order) => {
    // do what you need to do with the createdOrder data here
  });
````

### Variants

#### Get Variant
```typescript
const variantsRequest: VariantsRequest = {
  productId,
  inventoryItemValue
};
channelApeClient.variants().get(variantsRequest)
  .then((variant: Variant) => {
    // do what you need to do with variant data here
  });
```

#### Get Variants for a Product
```typescript
const variantsRequestByProductId: VariantsRequestByProductId = {
  productId
};
channelApeClient.variants().get(variantsRequestByProductId)
  .then((variants: Variant[]) => {
    // do what you need to do with variant array
  })
```

#### Get Variant Search Results for a Vendor
````typescript
const variantsRequest: VariantsSearchRequestByVendor = {
  vendor,
  businessId
};
channelApeClient.variants().search(variantsRequest)
  .then((variantSearchResults: VariantSearchResults[]) => {
    // do what you need to do with Variant Search Results array
  });
````

#### Get Variant Search Results using a Product Filter
````typescript
const variantsRequest: VariantsSearchRequestByProductFilterId = {
  productFilterId
};
channelApeClient.variants().search(variantsRequest)
  .then((variantSearchResults: VariantSearchResults[]) => {
    // do what you need to do with Variant Search Results array
  });
````

#### Get Variant Search Results for a SKU
````typescript
const variantsRequest: VariantsSearchRequestBySku = {
  sku,
  businessId
};
channelApeClient.variants().search(variantsRequest)
  .then((variantSearchResults: VariantSearchResults[]) => {
    // do what you need to do with Variant Search Results array
  });
````

#### Get Variant Search Results for a UPC
````typescript
const variantsRequest: VariantsSearchRequestByUpc = {
  upc,
  businessId
};
channelApeClient.variants().search(variantsRequest)
  .then((variantSearchResults: VariantSearchResults[]) => {
    // do what you need to do with Variant Search Results array
  });
````

#### Get Variant Search Results for a Tag
````typescript
const variantsRequest: VariantsSearchRequestByTag = {
  tag,
  businessId
};
channelApeClient.variants().search(variantsRequest)
  .then((variantSearchResults: VariantSearchResults[]) => {
    // do what you need to do with Variant Search Results array
  });
````

### Businesses

#### Get Business
```typescript
const businessesQueryRequestByBusinessId: BusinessesQueryRequestByBusinessId = {
  businessId
}
channelApeClient.businesses().get(businessesQueryRequestByBusinessId)
  .then((business: Business) => {
    // do what you need to do with business data here
  });
```

#### Get Businesses
```typescript
const businessesQueryRequestByUserId: BusinessesQueryRequestByUserId = {
  userId
}
channelApeClient.businesses().get(businessesQueryRequestByUserId)
  .then((businesses: Business[]) => {
    // do what you need to do with businesses array data here
  });
```
See [Sessions](#sessions) for how to retrieve your `userId`

### Subscriptions

#### Get Subscription
```typescript
const businessId = 'valid-business-id';
channelApeClient.subscriptions().get(businessId)
  .then((subscription: Subscription) => {
    // do what you need to do with subscription data here
  });
```

### Order Activities
ChannelApe allows you to log any arbitrary action done to or information about an order through the Order Activities endpoint.

#### Create order activities
```typescript
// Create an order activity if you know the channelId and channelOrderId of the order in question
const orderActivityCreateRequest: OrderActivityCreateRequestByChannel = {
  channelId: 'some-channel-id',
  channelOrderId: 'some-channel-order-id-belonging-to-the-specified-channel-id',
  operation: OrderActivityOperation.UPDATE,
  result: OrderActivityResult.SUCCESS,
  messages: [
    {
      description: 'Arbitrary text limited to 1000 characters',
      title: 'Arbitrary text limited to 100 characters.' // Order activities are grouped by title in the ChannelApe dashboard
    }
  ]
};

// Create an order activity if you know the ChannelApe Order ID (i.e. order.id) of the order in question
const orderActivityCreateRequest: OrderActivityCreateRequestByOrderId = {
  orderId: 'some-order-id',
  operation: OrderActivityOperation.CREATE,
  result: OrderActivityResult.ERROR,
  messages: [
    {
      description: 'Arbitrary text limited to 1000 characters',
      title: 'Arbitrary text limited to 100 characters.' // Order activities are grouped by title in the ChannelApe dashboard
    }
  ]
};

// Create an order activity if you know the channelOrderId and the businessId of the order in question
const orderActivityCreateRequest: OrderActivityCreateRequestByBusiness = {
  channelOrderId: 'some-channel-order-id',
  businessId: 'some-business-id-that-the-channel-order-id-belongs-to',
  operation: OrderActivityOperation.CREATE,
  result: OrderActivityResult.WARN,
  messages: [
    {
      description: 'Arbitrary text limited to 1000 characters',
      title: 'Arbitrary text limited to 100 characters.' // Order activities are grouped by title in the ChannelApe dashboard
    }
  ]
};

channelApeClient.orders().activities().create(orderActivityCreateRequest).then((orderActivity) => {
  // do what you need to do with orderActivity here
});
```