# ChannelApe SDK

TypeScript and JavaScript SDK for the [ChannelApe REST API](https://docs.channelape.io/)

[![Build Status](https://github.com/ChannelApe/channelape-typescript-sdk/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/ChannelApe/channelape-typescript-sdk/actions)  [![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=channelape-typescript-sdk&metric=coverage)](https://sonarcloud.io/dashboard?id=channelape-typescript-sdk)

## Features
- [Getting Started](#getting-started)
- [Errors](#errors)
- [Sessions](#sessions)
- [Actions](#actions)
- [Channels](#channels)
- [Suppliers](#suppliers)
- [Orders](#orders)
- [Variants](#variants)
- [Businesses](#businesses)
  - [API Accounts](#apiAccounts)
- [Subscriptions](#subscriptions)
- [Order Activities](#order-activities)
- [Analytics](#analytics)
- [Product Filters](#product-filters)
- [Users](#users)
- [Inventories](#inventories)
  - [Inventory Quantities](#inventory-quantities)
- [Locations](#locations)
- [Steps](#steps)
- [Plays](#plays)

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
* endpoint - Environment endpoint you would like to hit. Defaults to https://api.channelape.com
* logLevel - Level of logs you wish to see from the SDK. Defaults to OFF.
* maximumRequestRetryTimeout - Number of milliseconds to keep retrying a request for when an undesired response status code is received. Defaults to 180000 (3 minutes). Cannot be set lower than 2000 (2 seconds).
* minimumRequestRetryRandomDelay - Minimum number of milliseconds to randomly delay by when an undesired response status code is received. Defaults to 1000 (1 second). Cannot be set lower than 1000 (1 second).
* maximumRequestRetryRandomDelay - Maximum number of milliseconds to randomly delay by when an undesired response status code is received. Defaults to 5000 (5 seconds). Cannot be set lower than 2000 (2 seconds).
* maximumConcurrentConnections - Maximum number of connections or requests that can be made to the API at a single time.  Defaults to 5.


### Error Handling

When a call to the ChannelApe API returns an error, it can be accessed through the `ApiErrors` array on the error object.  The following is an example:
```typescript
try {
  newOrder = await client.orders().create(orderWithChannelOrderIdThatAlreadyExists);
} catch (error) {
  if (error?.ApiErrors?.code === 168) {
    ... Handle duplicate channel order ID error
  }
}
```

Error codes and descriptions can be found here: [Postman API Error Handling](https://docs.channelape.io/?version=latest#error-handling)


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

#### Create a channels for a business
```typescript
channelapeClient.channels().create({
      additionalFields: [],
      integrationId: 'some-valid-integration-id',
      name: 'channel-name',
      credentials: {
        healthCheckInterval: 300,
        payloadUrl: 'channelape.com'
      },
      businessId: 'some-valid-business-id',
      enabled: true
    })
  .then((channels: Channel) => {
    // do what you need to do with channel data here
  });
```

### Suppliers

#### Get supplier
```typescript
channelapeClient.suppliers().get(supplierId)
  .then((supplier: Supplier) => {
    // do what you need to do with supplier data here
  });
```

#### Get all suppliers for a business
```typescript
channelapeClient.suppliers().get({ businessId: 'some-valid-business-id' })
  .then((suppliers: Supplier[]) => {
    // do what you need to do with supplier data here
  });
```

#### Update a supplier
```typescript
channelapeClient.suppliers().update(supplierUpdateRequest)
  .then((supplier: Supplier) => {
    // do what you need to do with supplier data here
  });
```
#### Create a Play supplier
```typescript
channelapeClient.suppliers().create(SupplierCreateRequest)
  .then((supplier: Supplier) => {
    // do what you need to do with supplier data here
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

* *exactMatch* parameter if set to true will only match the exact sku set on the request instead of all sku's that start with that given character sequence.

````typescript
const variantsRequest: VariantsSearchRequestBySku = {
  sku,
  businessId,
  exactMatch: true
};
channelApeClient.variants().search(variantsRequest)
  .then((variantSearchResults: VariantSearchResults[]) => {
    // do what you need to do with Variant Search Results array
  });
````

#### Get Variant Search Results for a UPC

* *exactMatch* parameter if set to true will only match the exact upc set on the request instead of all upc's that start with that given character sequence.

````typescript
const variantsRequest: VariantsSearchRequestByUpc = {
  upc,
  businessId,
  exactMatch: true
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

#### Get Business Member
```typescript
const businessMemberRequest: BusinessMemberRequest = {
  userId,
  businessId
}
channelApeClient.businesses().getBusinessMember(businessMemberQueryRequest)
  .then((businessMember: BusinessMember) => {
    // do what you need to do with the business member here
  });
```

#### Get Business Members
```typescript
const businessMemberRequest: BusinessMemberRequest = {
  userId,
  businessId
}
channelApeClient.businesses().getBusinessUsers(businessId)
  .then((users: User[]) => {
    // do what you need to do with the business members here
  });
```

#### Invite a Member to a business
```typescript
const businessId = 'valid-business-id';
const email = 'valid-email-id';
channelApeClient.businesses().inviteMember(email, businessId)
then((invitationMember: InvitationResponse) => {
    // send invitationMember to a user
  });
```

#### Remove a Member from a business
```typescript
const businessId = 'valid-business-id';
const userId = 'valid-id';
channelApeClient.businesses().removeMember(businessId, userId)
then((removedMember: BusinessMember) => {
    // remove a member from business
  });
```
#### Update a Business's Settings
```typescript
const businessToUpdate: Business = {
  name: 'name',
  inventoryItemKey: InventoryItemKey.SKU,
  timeZone: TimeZoneId.US_ALASKA,
  alphabeticCurrencyCode: AlphabeticCurrencyCode.USD,
  id: 'valid-id',
  embeds: [],
  errors: []
}
channelApeClient.businesses().update(businessToUpdate)
  .then((updatedBusiness: Business) => {
    // do what you need to do with the updated business here 
  });
```
#### Verify Business Member
```typescript
const verificationCode = '1234567';
channelApeClient.businesses().verifyBusinessMember(verificationCode)
  .then((business: Business) => {
    // do what you need to do with the business here
  });
```

#### Create Business
```typescript
const businessToCreate: BusinessCreateRequest = {
  name: 'Valid Business Name',
  timeZone: TimeZoneId.AMERICA_NEW_YORK,
  inventoryItemKey: InventoryItemKey.SKU,
  alphabeticCurrencyCode: AlphabeticCurrencyCode.USD
}
channelApeClient.businesses().create(businessToCreate)
  .then((business: Business) => {
    // do what you need to do with the newly created business here 
  });
```


#### API Accounts

##### Get API Account By ID
```typescript
const businessId = 'valid-business-id';
const apiAccountId = 'valid-api-account-id';
channelApeClient.businesses().apiAccounts().get(businessId, apiAccountId)
  .then((apiAccount: ApiAccount) => {
    // do what you need to do with the API account here 
  });
```

##### Get All API Accounts for a Business
```typescript
const businessId = 'valid-business-id';
channelApeClient.businesses().apiAccounts().get(businessId)
  .then((apiAccount: ApiAccount[]) => {
    // do what you need to do with the API accounts here 
  });
```

##### Create API Account
```typescript
const businessId = 'valid-business-id';
const apiKeyName = 'some-api-key';
channelApeClient.businesses().apiAccounts().create(name, businessId)
  .then((apiAccount: ApiAccount) => {
    // do what you need to do with the API account here 
  });
```

##### Delete API Account from a business
```typescript
const businessId = 'valid-business-id';
const apiAccountId = 'valid-api-account-id';
channelApeClient.businesses().apiAccounts().delete(businessId, apiAccountId)
  .then((deleteAccount: ApiAccount) => {
    // do what you need to do with the API account here 
  });
```

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


### Analytics

### Generate Analytics Embed
This can only be done with an end user account that has access to ChannelApe analytics.
```typescript
const embedCode = 'valid-embed-code';
const timezone = 'America/New_York';
channelApeClient.analytics().generateEmbed(embedCode, timezone)
  .then((embed: Embed) => {
    // Render the embed in an iframe or in a browser.
  });
```

### Available Analytics Embeds
```typescript
channelApeClient.analytics().get()
  .then((reports[]: Embed) => {
    // Do what you need to with list of reports
  });
```

### Get Analytics Token
```typescript
channelApeClient.analytics().getToken()
  .then((token: Token) => {
    // Do what you need to with the token
  });
```


### Product Filters

### Create Product Filter
```typescript
const productFilterRequest: ProductFilterRequest = {
  businessId: 'valid-business-id'
};
channelApeClient.productFilter().create({}, productFilterRequest)
  .then((productFilter: ProductFilter) => {
    // Do what you need with the filter
  });
```


### Users

#### Get User
```typescript
const userId: string = 'some-user-id';
channelApeClient.users().get(userId)
  .then((user: User) => {
    // Do what you need with the user
  });
```

### Inventories

### Get inventory item
```typescript
const inventoryItemId: string = 'some-inventory-id';
channelApeClient.inventories().get(inventoryItemId)
  .then((inventoryItem: InventoryItem) => {
    // Do what you need with the inventory item
  });
```

### Get businesses inventory item by SKU
```typescript
const inventorySku: string = 'ABC-123';
const businessId: string = '1';
channelApeClient.inventories().get(businessId, inventorySku)
  .then((inventoryItems: InventoryItem[]) => {
    // Do what you need with the inventory items
  });
```

### Create new Inventory Item
```typescript
const inventoryItemCreateRequest: InventoryItemCreateRequest = {
  businessId: '1',
  sku: 'ABC-123',
  title: 'Cool inventory title'
};
channelApeClient.inventories().create(inventoryItemCreateRequest)
  .then((inventoryItem: InventoryItem) => {
    // Do what you need with the created inventory item
  });
```

### Update Inventory Item
```typescript
const inventoryItemUpdateRequest: InventoryItemUpdateRequest = {
  id: '123',
  sku: 'ABC-123',
  title: 'Cool inventory title'
};
channelApeClient.inventories().update(inventoryItemUpdateRequest)
  .then((inventoryItem: InventoryItem) => {
    // Do what you need with the updated inventory item
  });
```

### Inventory Quantities

### Adjust Inventory Item Quantity
```typescript
const inventoryItemId = '34';
const locationId = '28';
const quantity = 31;
const inventoryStatus =  InventoryStatus.AVAILABLE_TO_SELL;
const adjustmentRequest: AdjustmentRequest = {
  inventoryItemId,
  locationId,
  quantity,
  inventoryStatus
};
channelApeClient.inventories().quantities().adjust(adjustmentRequest)
  .then((adjustment: Adjustment) => {
    // Do what you need with the adjustment
  });
```

### Set Inventory Item Quantity
- idempotentKey is optional. It will default to a UUID if nothing is provided. This key is used to 
determine if an adjustment should be created or if it is a duplicate.
```typescript
const inventoryItemId = '34';
const locationId = '28';
const quantity = -148;
const inventoryStatus =  InventoryStatus.ON_ORDER;
const idempotentKey  = `${new Date().toISOString()}_${locationId}_${inventoryItemId}_${inventoryStatus}`;
const adjustmentRequest: AdjustmentRequest = {
  inventoryItemId,
  locationId,
  quantity,
  inventoryStatus,
  idempotentKey
};
channelApeClient.inventories().quantities().set(adjustmentRequest)
  .then((adjustment: Adjustment) => {
    // Do what you need with the adjustment
  });
```

### Batch Update Inventory Item Quantity

- If at least one adjustment fails, the call will wait for all other pending requests
to complete and then throw an error.
- The deduplication key specifies a string which will be used to determine if an adjustment
should be created.  If a key with the same string for a particular inventory item, location, 
and status was already used, it will not perform the adjustment.  For example, this can be 
used to allow only one adjustment per day so that if the batched adjustments are sent through 
a second time, only the ones which failed will be recreated.
Here is the generated key format: {deduplicationKey}\_{locationId}\_{inventoryItemId}\_{status}

Currently Allowed Inventory Statuses:
- AVAILABLE_TO_SELL
- ON_HOLD
- ON_HAND
- COMMITTED
- ON_ORDER

```typescript
const adjustmentsBySku: AdjustmentsBySku = [{
  sku: 'A1',
  adjustments: [{
    quantity: 1,
    inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
    deduplicationKey: '05052020',
    locationId: '123',
    memo: 'Memo'
  }, {
    quantity: 3,
    inventoryStatus: InventoryStatus.ON_HOLD,
    deduplicationKey: '05052020',
    locationId: '123',
    memo: 'Memo'
  }]
}, {
  sku: 'B1',
  adjustments: [{
    quantity: 2,
    inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
    deduplicationKey: '05052020',
    locationId: '123',
    memo: 'Memo'
  }, {
    quantity: 0,
    inventoryStatus: InventoryStatus.ON_HOLD,
    deduplicationKey: '05052020',
    locationId: '123',
    memo: 'Memo'
  }]
}];
```

#### Batch Set Inventory Item Quantities

```typescript
channelApeClient.inventories().quantities().setBatch(adjustmentsBySku)
  .then(() => {
    // All adjustments completed successfully
  });
```

#### Batch Adjust Inventory Item Quantities

```typescript
channelApeClient.inventories().quantities().adjustBatch(adjustmentsBySku)
  .then(() => {
    // All adjustments completed successfully
  });
```

### Retrieve an inventory item's current quantities
```typescript
const inventoryItemId = '35';
channelApeClient.inventories().quantities().retrieve(inventoryItemId)
  .then((quantities: InventoryItemQuantity[]) => {
    // Do what you need with the inventory item quantities
  });
```

### Locations

### Get location
```typescript
const locationId: string = 'some-location-id';
channelApeClient.locations().get(locationId)
  .then((location: Location) => {
    // Do what you need with the location
  });
```

### Get locations for a business
```typescript
const businessId: string = '1';
channelApeClient.locations().getByBusinessId(businessId)
  .then((location: Location) => {
    // Do what you need with the locations
  });
```

### Create new Location
```typescript
const locationCreationRequest: LocationCreateRequest = {
  businessId: '1',
  name: 'Some location Name'
};
channelApeClient.locations().create(locationCreationRequest)
  .then((location: Location) => {
    // Do what you need with the created location
  });
```

### Update Location
```typescript
const locationUpdateRequest: LocationUpdateRequest = {
  id: '123',
  name: 'Some updated location Name'
};
channelApeClient.locations().update(locationUpdateRequest)
  .then((location: Location) => {
    // Do what you need with the updated location
  });
```

### Get location SLA
```typescript
const locationId: string = '1';
channelApeClient.locations().getSLA(locationId)
  .then((locationSLA: LocationSLA) => {
    // Do what you need with the locations
  });
```

### Get location closures
```typescript
const locationId: string = '1';
channelApeClient.locations().getClosures(locationId)
  .then((locationClosures: LocationClosedDay[]) => {
    // Do what you need with the locations
  });
```

### Update location closures
```typescript
const closesDates: LocationClosureRequest = {
   closedDays: [
    '2021/02/01',
    '2021/03/01',
    '2021/04/01',
    '2021/05/01',
    '2021/06/01'
    ]
  };
const locationId: string = '1';
channelApeClient.locations().updateClosures(locationId, closedDates)
  .then((locationClosures: LocationClosedDay[]) => {
    // Do what you need with the locations closures update
  });
```

### Steps

#### Get step by ID
```typescript
channelapeClient.steps().get(stepId)
  .then((step: Step) => {
    // do what you need to do with step data here
  });
```

### Plays

#### Get Play by ID
```typescript
channelapeClient.plays().get(playId)
  .then((play: Play) => {
    // do what you need to do with play data here
  });
```