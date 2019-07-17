import AlphabeticCurrencyCode from '../../model/AlphabeticCurrencyCode';
import InventoryItemKey from '../../model/InventoryItemKey';
import TimeZoneId from '../../model/TimeZoneId';

export default interface BusinessCreateRequest {
  alphabeticCurrencyCode: AlphabeticCurrencyCode;
  inventoryItemKey: InventoryItemKey;
  name: string;
  timeZone: TimeZoneId;
}
