import InventoryItem from './InventoryItem';
import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface InventoryItemsResponse {
  inventoryItems: InventoryItem[];
  errors: ChannelApeApiError[];
}
