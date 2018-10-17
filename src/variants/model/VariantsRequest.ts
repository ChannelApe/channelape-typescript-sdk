import VariantsRequestByProductId from './VariantsRequestByProductId';

export default interface VariantsRequest extends VariantsRequestByProductId {
  inventoryItemValue: string;
}
