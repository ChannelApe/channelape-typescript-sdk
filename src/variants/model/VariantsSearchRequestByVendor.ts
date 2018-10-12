import VariantsSearchRequestByBusinessId from './VariantsSearchRequestByBusinessId';
import PaginationQueryRequest from '../../model/PaginationQueryRequest';

export default interface VariantsSearchByVendor extends VariantsSearchRequestByBusinessId, PaginationQueryRequest {
  vendor: string;
  size?: number;
}
