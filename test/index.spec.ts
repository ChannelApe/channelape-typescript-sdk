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

  it('Expect Business to be exported', () => {
    const business: ChannelApe.Business = {
      alphabeticCurrencyCode: ChannelApe.AlphabeticCurrencyCode.USD,
      embeds: [],
      errors: [],
      id: 'business-id',
      inventoryItemKey: ChannelApe.InventoryItemKey.SKU,
      name: 'My Test Business',
      timeZone: ChannelApe.TimeZoneId.US_EASTERN
    };
    expect(business.id).to.equal('business-id');
  });

  it('Expect BusinessesQueryRequestByUserId to be exported', () => {
    const businessesQueryRequestByBusinessId: ChannelApe.BusinessesQueryRequestByBusinessId = {
      businessId: 'businessId'
    };
    expect(businessesQueryRequestByBusinessId.businessId).to.equal('businessId');
  });

  it('Expect BusinessesQueryRequestByBusinessId to be exported', () => {
    const businessQueryRequestByUserId: ChannelApe.BusinessesQueryRequestByUserId = {
      userId: 'userId'
    };
    expect(businessQueryRequestByUserId.userId).to.equal('userId');
  });

  it('Expect AlphabeticCurrencyCode to be exported', () => {
    expect(ChannelApe.AlphabeticCurrencyCode).to.equal(ChannelApe.AlphabeticCurrencyCode);
  });

  it('Expect TimeZoneId to be exported', () => {
    expect(ChannelApe.TimeZoneId).to.equal(ChannelApe.TimeZoneId);
  });

  it('Expect InventoryItemKey to be exported', () => {
    expect(ChannelApe.InventoryItemKey).to.equal(ChannelApe.InventoryItemKey);
  });

  it('Expect Action to be exported', () => {
    const action: ChannelApe.Action = {
      action: 'actionId',
      businessId: 'businessId',
      description: 'desc',
      healthCheckIntervalInSeconds: 3000,
      id: 'id',
      lastHealthCheckTime: new Date(),
      processingStatus: ChannelApe.ActionProcessingStatus.IN_PROGRESS,
      startTime: new Date(),
      targetId: 'targetId',
      targetType: 'channel'
    };
    expect(action.id).to.equal('id');
  });

  it('Expect ActionProcessingStatus to be exported', () => {
    expect(ChannelApe.ActionProcessingStatus).to.equal(ChannelApe.ActionProcessingStatus);
  });

  it('Expect ActionsRequest to be exported', () => {
    const actionsRequest: ChannelApe.ActionsQueryRequest = {
      businessId: 'businessId',
      endDate: new Date(),
      startDate: new Date(),
      lastKey: 'lastKey',
      size: 10
    };
    expect(actionsRequest.businessId).to.equal('businessId');
  });

  it('Expect Channel to be exported', () => {
    const channel: ChannelApe.Channel = {
      additionalFields: [],
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

  it('Expect ChannelsQueryRequestByBusinessId to be exported', () => {
    const channelsQueryRequestByBusinessId: ChannelApe.ChannelsQueryRequestByBusinessId = {
      businessId: 'some-business-id'
    };
    expect(channelsQueryRequestByBusinessId.businessId).to.equal('some-business-id');
  });

  it('Expect Supplier to be exported', () => {
    const supplier: ChannelApe.Supplier = {
      businessId: 'business-id',
      createdAt: new Date(),
      enabled: true,
      id: 'supplier-id',
      integrationId: 'integration-id',
      name: 'supplier-name',
      updatedAt: new Date(),
      fileSettings: {
        additionalFieldsMapping: [],
        descriptionMapping: [],
        imagesMapping: [],
        optionsMapping: [],
        primaryCategoryMapping: {
          columnIndex: 8,
          sourceId: 'feed_1'
        },
        productMapping: {
          columnIndex: 7,
          sourceId: 'feed_1'
        },
        productTagsMapping: [],
        quantityMapping: [],
        removedFromFeedTag: 'some-tag',
        retailPriceMapping: {
          columnIndex: 0,
          currencyCode: ChannelApe.AlphabeticCurrencyCode.USD,
          sourceId: 'feed_1'
        },
        secondaryCategoryMapping: {
          columnIndex: 1,
          sourceId: 'feed_1'
        },
        skuMapping: {
          columnIndex: 2,
          sourceId: 'feed_2'
        },
        sources: [],
        tagsMapping: [],
        titleMapping: [],
        upcMapping: {
          columnIndex: 3,
          sourceId: 'feed_1'
        },
        vendorMapping: {
          columnIndex: 4,
          sourceId: 'feed_1'
        },
        weightMapping: {
          columnIndex: 5,
          sourceId: 'feed_1',
          unitOfMeasurement: ChannelApe.UnitOfMeasurement.OUNCES
        },
        wholesalePriceMapping: {
          columnIndex: 6,
          currencyCode: ChannelApe.AlphabeticCurrencyCode.USD,
          sourceId: 'feed_1'
        }
      }
    };
    expect(supplier.id).to.equal('supplier-id');
  });

  it('Expect SuppliersQueryRequestByBusinessId to be exported', () => {
    const suppliersQueryRequestByBusinessId: ChannelApe.SuppliersQueryRequestByBusinessId = {
      businessId: 'business-id'
    };
    expect(suppliersQueryRequestByBusinessId.businessId).to.equal('business-id');
  });

  it('Expect FileSettings to be exported', () => {
    const fileSettings: ChannelApe.FileSettings = {
      additionalFieldsMapping: [],
      descriptionMapping: [],
      imagesMapping: [],
      optionsMapping: [],
      primaryCategoryMapping: {
        columnIndex: 8,
        sourceId: 'feed_1'
      },
      productMapping: {
        columnIndex: 7,
        sourceId: 'feed_1'
      },
      productTagsMapping: [],
      quantityMapping: [],
      removedFromFeedTag: 'some-tag',
      retailPriceMapping: {
        columnIndex: 0,
        currencyCode: ChannelApe.AlphabeticCurrencyCode.USD,
        sourceId: 'feed_1'
      },
      secondaryCategoryMapping: {
        columnIndex: 1,
        sourceId: 'feed_1'
      },
      skuMapping: {
        columnIndex: 2,
        sourceId: 'feed_2'
      },
      sources: [],
      tagsMapping: [],
      titleMapping: [],
      upcMapping: {
        columnIndex: 3,
        sourceId: 'feed_1'
      },
      vendorMapping: {
        columnIndex: 4,
        sourceId: 'feed_1'
      },
      weightMapping: {
        columnIndex: 5,
        sourceId: 'feed_1',
        unitOfMeasurement: ChannelApe.UnitOfMeasurement.OUNCES
      },
      wholesalePriceMapping: {
        columnIndex: 6,
        currencyCode: ChannelApe.AlphabeticCurrencyCode.USD,
        sourceId: 'feed_1'
      }
    };
    expect(fileSettings.primaryCategoryMapping.columnIndex).to.equal(8);
  });

  it('Expect FileSettingsAdditionalFields to be exported', () => {
    const fileSettingsAdditionalFields: ChannelApe.FileSettingsAdditionalFields = {
      columnIndex: 1,
      key: 'some-key',
      sourceId: 'feed_1'
    };
    expect(fileSettingsAdditionalFields.columnIndex).to.equal(1);
  });

  it('Expect FileSettingsAuthorization to be exported', () => {
    const fileSettingsAuthorization: ChannelApe.FileSettingsAuthorization = {
      passwordKey: 'password',
      usernameKey: 'username'
    };
    expect(fileSettingsAuthorization.passwordKey).to.equal('password');
    expect(fileSettingsAuthorization.usernameKey).to.equal('username');
  });

  it('Expect FileSettingsMapping to be exported', () => {
    const fileSettingsMapping: ChannelApe.FileSettingsMapping = {
      columnIndex: 0,
      sourceId: 'feed_1'
    };
    expect(fileSettingsMapping.columnIndex).to.equal(0);
    expect(fileSettingsMapping.sourceId).to.equal('feed_1');
  });

  it('Expect FileSettingsOptions to be exported', () => {
    const fileSettingsOptions: ChannelApe.FileSettingsOptions = {
      columnIndex: 0,
      sourceId: 'feed_1',
      key: 'option-key-1',
      keyColumnIndex: 1
    };
    expect(fileSettingsOptions.columnIndex).to.equal(0);
    expect(fileSettingsOptions.sourceId).to.equal('feed_1');
    expect(fileSettingsOptions.key).to.equal('option-key-1');
    expect(fileSettingsOptions.keyColumnIndex).to.equal(1);
  });

  it('Expect FileSettingsPrefixSuffix to be exported', () => {
    const fileSettingsPrefixSuffix: ChannelApe.FileSettingsPrefixSuffix = {
      columnIndex: 0,
      sourceId: 'feed_1',
      prefix: 'prefix',
      suffix: 'suffix'
    };
    expect(fileSettingsPrefixSuffix.columnIndex).to.equal(0);
    expect(fileSettingsPrefixSuffix.sourceId).to.equal('feed_1');
    expect(fileSettingsPrefixSuffix.prefix).to.equal('prefix');
    expect(fileSettingsPrefixSuffix.suffix).to.equal('suffix');
  });

  it('Expect FileSettingsPrice to be exported', () => {
    const fileSettingsPrice: ChannelApe.FileSettingsPrice = {
      columnIndex: 0,
      sourceId: 'feed_1',
      currencyCode: ChannelApe.AlphabeticCurrencyCode.USD
    };
    expect(fileSettingsPrice.columnIndex).to.equal(0);
    expect(fileSettingsPrice.sourceId).to.equal('feed_1');
    expect(fileSettingsPrice.currencyCode).to.equal(ChannelApe.AlphabeticCurrencyCode.USD);
  });

  it('Expect FileSettingsSources to be exported', () => {
    const fileSettingsSources: ChannelApe.FileSettingsSources = {
      authorization: {
        passwordKey: 'password',
        usernameKey: 'username'
      },
      fileType: 'csv',
      headers: true,
      id: 'file-settings-sources-id',
      joinIndex: 5,
      url: 'http://example.com'
    };
    expect(fileSettingsSources.authorization!.passwordKey).to.equal('password');
    expect(fileSettingsSources.authorization!.usernameKey).to.equal('username');
    expect(fileSettingsSources.fileType).to.equal('csv');
    expect(fileSettingsSources.headers).to.equal(true);
    expect(fileSettingsSources.id).to.equal('file-settings-sources-id');
    expect(fileSettingsSources.joinIndex).to.equal(5);
    expect(fileSettingsSources.url).to.equal('http://example.com');
  });

  it('Expect FileSettingsValue to be exported', () => {
    const fileSettingsValue: ChannelApe.FileSettingsValue = {
      value: 'any-value'
    };
    expect(fileSettingsValue.value).to.equal('any-value');
  });

  it('Expect FileSettingsWeight to be exported', () => {
    const fileSettingsWeight: ChannelApe.FileSettingsWeight = {
      columnIndex: 0,
      sourceId: 'feed_1',
      unitOfMeasurement: ChannelApe.UnitOfMeasurement.KILOGRAMS
    };
    expect(fileSettingsWeight.columnIndex).to.equal(0);
    expect(fileSettingsWeight.sourceId).to.equal('feed_1');
    expect(fileSettingsWeight.unitOfMeasurement).to.equal(ChannelApe.UnitOfMeasurement.KILOGRAMS);
  });

  it('Expect UnitOfMeasurement to be exported', () => {
    const unitOfMeasurement: ChannelApe.UnitOfMeasurement = ChannelApe.UnitOfMeasurement.POUNDS;
    expect(unitOfMeasurement).to.equal('lb');
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
      status: ChannelApe.FulfillmentStatus.SUCCESS
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

  it('Expect OrderCreateRequest to be exported', () => {
    const orderCreateRequest: ChannelApe.OrderCreateRequest = {
      additionalFields: [
        {
          name: 'closed_at',
          value: 'null'
        }],
      alphabeticCurrencyCode: 'USD',
      channelId: '0d134d16-ad7e-4724-841e-7d46e0f128bd',
      channelOrderId: '314980073478',
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
      fulfillments: [],
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
    };
    expect(orderCreateRequest.channelOrderId).to.equal('314980073478');
  });

  it('Expect OrderUpdateRequest to be exported', () => {
    const orderUpdateRequest: ChannelApe.OrderUpdateRequest = {
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
    expect(orderUpdateRequest.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a');
  });

  it('Expect OrderPatchRequest to be exported', () => {
    const orderPatchRequest: ChannelApe.OrderPatchRequest = {
      id: 'c0f45529-cbed-4e90-9a38-c208d409ef2a',
      status: ChannelApe.OrderStatus.IN_PROGRESS
    };
    expect(orderPatchRequest.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a');
  });

  it('Expect OrdersRequestByBusinessId to be exported', () => {
    const ordersRequestByBusinessId: ChannelApe.OrdersQueryRequestByBusinessId = {
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
    const ordersRequestByChannel: ChannelApe.OrdersQueryRequestByChannel = {
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
    const ordersRequestByChannelOrderId: ChannelApe.OrdersQueryRequestByChannelOrderId = {
      businessId: 'businessId',
      channelOrderId: 'channelOrderId'
    };
    expect(ordersRequestByChannelOrderId.channelOrderId).to.equal('channelOrderId');
  });

  it('Expect OrderActivityCreateRequestByChannel to be exported', () => {
    const orderActivityCreateRequestByChannel: ChannelApe.OrderActivityCreateRequestByChannel = {
      channelId: 'channelId',
      channelOrderId: 'channelOrderId',
      operation: ChannelApe.OrderActivityOperation.CREATE,
      result: ChannelApe.OrderActivityResult.SUCCESS
    };
    expect(orderActivityCreateRequestByChannel.channelOrderId).to.equal('channelOrderId');
  });

  it('Expect OrderActivityCreateRequestByBusiness to be exported', () => {
    const orderActivityCreateRequestByBusiness: ChannelApe.OrderActivityCreateRequestByBusiness = {
      businessId: 'some-business-id',
      channelOrderId: 'some-channel-order-id',
      operation: ChannelApe.OrderActivityOperation.CREATE,
      result: ChannelApe.OrderActivityResult.SUCCESS
    };
    expect(orderActivityCreateRequestByBusiness.businessId).to.equal('some-business-id');
  });

  it('Expect OrderActivityCreateRequestByOrderId to be exported', () => {
    const orderActivityCreateRequestByOrderId: ChannelApe.OrderActivityCreateRequestByOrderId = {
      orderId: 'orderId',
      operation: ChannelApe.OrderActivityOperation.CREATE,
      result: ChannelApe.OrderActivityResult.SUCCESS
    };
    expect(orderActivityCreateRequestByOrderId.orderId).to.equal('orderId');
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

  it('Expect ChannelApeError to be exported', () => {
    expect(typeof ChannelApe.ChannelApeError).not.to.equal('undefined');
  });

  it('Expect VariantsSearchRequestByTag to be exported', () => {
    const variantsSearchRequestByTag: ChannelApe.VariantsSearchRequestByTag = {
      tag: 'tag',
      businessId: 'businessId'
    };
    expect(variantsSearchRequestByTag.tag).to.equal('tag');
  });

  it('Expect Subscription to be exported', () => {
    const subscription: ChannelApe.Subscription = {
      active: true,
      errors: []
    };
    expect(subscription.active).to.equal(true);
  });

  it('Expect InventoryStatus to be exported', () => {
    const inventoryStatus: ChannelApe.InventoryStatus = ChannelApe.InventoryStatus.ON_HAND;
    expect(inventoryStatus).to.equal(ChannelApe.InventoryStatus.ON_HAND);
  });

  it('Expect InventoryItem to be exported', () => {
    const inventoryItem: ChannelApe.InventoryItem = {
      id: '4454',
      businessId: '39393',
      sku: 'ABC-123',
      title: 'Cool inventory title',
      createdAt: new Date('2018-05-03T18:07:58.009Z'),
      updatedAt: new Date('2018-05-05T18:07:58.009Z')
    };
    expect(inventoryItem.sku).to.equal('ABC-123');
  });

  it('Expect InventoryItemCreateRequest to be exported', () => {
    const inventoryItemCreateRequest: ChannelApe.InventoryItemCreateRequest = {
      businessId: '39393',
      sku: 'ABC-123',
    };
    expect(inventoryItemCreateRequest.sku).to.equal('ABC-123');
  });

  it('Expect InventoryItemUpdateRequest to be exported', () => {
    const inventoryItemUpdateRequest: ChannelApe.InventoryItemUpdateRequest = {
      id: '39393',
      sku: 'ABC-123',
    };
    expect(inventoryItemUpdateRequest.sku).to.equal('ABC-123');
  });

  it('Expect AdjustmentRequest to be exported', () => {
    const inventoryItemId = '34';
    const locationId = '28';
    const quantity = 31;
    const inventoryStatus = ChannelApe.InventoryStatus.AVAILABLE_TO_SELL;
    const adjustmentRequest: ChannelApe.AdjustmentRequest = {
      inventoryItemId,
      locationId,
      quantity,
      inventoryStatus
    };
    expect(adjustmentRequest.locationId).to.equal('28');
  });

  it('Expect Adjustment to be exported', () => {
    const inventoryItemId = '34';
    const locationId = '28';
    const inventoryStatus = ChannelApe.InventoryStatus.AVAILABLE_TO_SELL;
    const adjustment: ChannelApe.Adjustment = {
      inventoryItemId,
      locationId,
      inventoryStatus,
      quantity: 100,
      adjustment: 4,
      createdAt: new Date('2018-05-03T18:07:58.009Z'),
      updatedAt: new Date('2018-05-05T18:07:58.009Z')
    };
    expect(adjustment.adjustment).to.equal(4);
  });

  it('Expect AdjustmentBySku to be exported', () => {
    const adjustmentBySku: ChannelApe.AdjustmentBySku = {
      status: ChannelApe.InventoryStatus.COMMITTED,
      quantity: 44
    };
    expect(adjustmentBySku.quantity).to.equal(44);
  });

  it('Expect AdjustmentsBySku to be exported', () => {
    const adjustmentsBySku: ChannelApe.AdjustmentsBySku = {
      sku: 'ABC-123',
      adjustments: [
        {
          status: ChannelApe.InventoryStatus.COMMITTED,
          quantity: 44
        },
        {
          status: ChannelApe.InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 20
        }
      ]
    };
    expect(adjustmentsBySku.adjustments.length).to.equal(2);
  });

  it('Expect BatchAdjustmentRequest to be exported', () => {
    const batchAdjustmentRequest: ChannelApe.BatchAdjustmentRequest = {
      locationId: '123',
      deduplicationKey: '05052020',
      adjustmentsBySku: [{
        sku: 'A1',
        adjustments: [{
          quantity: 1,
          status: ChannelApe.InventoryStatus.AVAILABLE_TO_SELL
        }, {
          quantity: 3,
          status: ChannelApe.InventoryStatus.ON_HOLD
        }]
      }, {
        sku: 'B1',
        adjustments: [{
          quantity: 2,
          status: ChannelApe.InventoryStatus.AVAILABLE_TO_SELL
        }, {
          quantity: 0,
          status: ChannelApe.InventoryStatus.ON_HOLD
        }]
      }]
    };
    expect(batchAdjustmentRequest.deduplicationKey).to.equal('05052020');
  });

  it('Expect InventoryItemQuantity to be exported', () => {
    const inventoryItemQuantity: ChannelApe.InventoryItemQuantity = {
      locationId: '44',
      inventoryStatus: ChannelApe.InventoryStatus.COMMITTED,
      quantity: 443
    };
    expect(inventoryItemQuantity.quantity).to.equal(443);
  });

  it('Expect Location to be exported', () => {
    const location: ChannelApe.Location = {
      id: '444',
      name: 'My 3PL',
      businessId: '440404',
      createdAt: new Date('2018-05-03T18:07:58.009Z'),
      updatedAt: new Date('2018-05-05T18:07:58.009Z')
    };
    expect(location.name).to.equal('My 3PL');
  });

  it('Expect LocationCreateRequest to be exported', () => {
    const locationCreateRequest: ChannelApe.LocationCreateRequest = {
      name: 'My 3PL',
      businessId: '440404',
    };
    expect(locationCreateRequest.name).to.equal('My 3PL');
  });

  it('Expect LocationUpdateRequest to be exported', () => {
    const locationUpdateRequest: ChannelApe.LocationUpdateRequest = {
      name: 'My 3PL',
      id: '3432'
    };
    expect(locationUpdateRequest.name).to.equal('My 3PL');
  });

});
