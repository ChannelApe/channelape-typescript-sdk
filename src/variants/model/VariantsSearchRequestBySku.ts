import VariantsSearchRequestByBusinessId from './VariantsSearchRequestByBusinessId';

export default interface VariantsSearchBySku extends VariantsSearchRequestByBusinessId {
  sku: string;
}
