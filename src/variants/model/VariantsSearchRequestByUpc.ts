import VariantsSearchRequestByBusinessId from './VariantsSearchRequestByBusinessId';

export default interface VariantsSearchRequestByUpc extends VariantsSearchRequestByBusinessId {
  upc: string;
}
