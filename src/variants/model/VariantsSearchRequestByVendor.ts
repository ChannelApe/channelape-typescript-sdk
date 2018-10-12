import VariantsSearchRequestByBusinessId from './VariantsSearchRequestByBusinessId';

export default interface VariantsSearchByVendor extends VariantsSearchRequestByBusinessId {
  vendor: string;
}
