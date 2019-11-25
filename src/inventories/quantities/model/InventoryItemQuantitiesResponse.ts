import ChannelApeApiError from '../../../model/ChannelApeApiError';
import InventoryItemQuantity from './InventoryItemQuantity';

export default interface InventoryItemQuantitiesResponse {
  quantities: InventoryItemQuantity[];
  errors: ChannelApeApiError[];
}
