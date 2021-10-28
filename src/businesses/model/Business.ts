import InventoryItemKey from '../../model/InventoryItemKey';
import ChannelApeApiError from '../../model/ChannelApeApiError';
import TimeZoneId from '../../model/TimeZoneId';
import AlphabeticCurrencyCode from '../../model/AlphabeticCurrencyCode';
import { Users } from '../../users/model/User';

export default interface Business {
  alphabeticCurrencyCode: AlphabeticCurrencyCode;
  embeds: string[];
  errors?: ChannelApeApiError[];
  id: string;
  inventoryItemKey: InventoryItemKey;
  name: string;
  timeZone: TimeZoneId;
}
export interface BusinessMembers{
  errors:string[];
  Users:Users[];
}
