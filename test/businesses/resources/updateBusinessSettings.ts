import Business from '../../../src/businesses/model/Business';
import TimeZoneId from '../../../src/model/TimeZoneId';
import InventoryItemKey from '../../../src/model/InventoryItemKey';
import AlphabeticCurrencyCode from '../../../src/model/AlphabeticCurrencyCode';

const updateBusinessSettings: Business = {
  name: 'DEMO MK',
  inventoryItemKey: InventoryItemKey.SKU,
  timeZone: TimeZoneId.US_ALASKA,
  alphabeticCurrencyCode: AlphabeticCurrencyCode.USD,
  id: '64d70831-c365-4238-b3d8-6077bebca788',
  embeds: [],
  errors: []
};

export default updateBusinessSettings;
