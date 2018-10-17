import VariantsRequestByProductId from './VariantsRequestByProductId';
import InventoryItemKey from '../../model/InventoryItemKey';

export default interface VariantsRequest extends VariantsRequestByProductId {
  inventoryItemValue: InventoryItemKey;
}
