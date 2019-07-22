import Business from '../../../src/businesses/model/Business';
import TimeZoneId from '../../../src/model/TimeZoneId';
import InventoryItemKey from '../../../src/model/InventoryItemKey';
import AlphabeticCurrencyCode from '../../../src/model/AlphabeticCurrencyCode';

const singleBusiness: Business = {
  alphabeticCurrencyCode: AlphabeticCurrencyCode.USD,
  embeds: [],
  errors: [],
  id: '62096199-0aa4-4ebb-bab0-8bd887507265',
  inventoryItemKey: InventoryItemKey.SKU,
  name: 'Some Test Business Name',
  timeZone: TimeZoneId.AMERICA_NEW_YORK
};

export default singleBusiness;
