import VariantsRequestByProductId from './VariantsRequestByProductId';

export default interface VariantsRequest extends VariantsRequestByProductId {
  skuOrUpc: string;
}
