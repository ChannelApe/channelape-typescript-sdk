import VariantsSearchRequestByBusinessId from './VariantsSearchRequestByBusinessId';
import PaginationQueryRequest from '../../model/PaginationQueryRequest';

export default interface VariantsSearchByTag extends VariantsSearchRequestByBusinessId, PaginationQueryRequest {
  tag: string;
  size?: number;
}
