import VariantsSearchRequestByBusinessId from './VariantsSearchRequestByBusinessId';
import PaginationQueryRequest from '../../model/PaginationQueryRequest';

export default interface VariantsSearchBySku extends VariantsSearchRequestByBusinessId, PaginationQueryRequest {
  sku: string;
  size?: number;
}
