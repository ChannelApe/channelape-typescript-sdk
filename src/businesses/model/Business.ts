import InventoryItemKey from './InventoryItemKey';
import ChannelApeApiError from '../../model/ChannelApeApiError';
import TimeZoneId from '../../model/TimeZoneId';
import AlphabeticCurrencyCode from '../../model/AlphabeticCurrencyCode';

export default interface Business {
  alphabeticCurrencyCode: AlphabeticCurrencyCode;
  embeds: any[];
  errors?: ChannelApeApiError[];
  id: string;
  inventoryItemKey: InventoryItemKey;
  name: string;
  timeZone: TimeZoneId;
}
