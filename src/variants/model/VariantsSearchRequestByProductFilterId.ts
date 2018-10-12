import PaginationQueryRequest from '../../model/PaginationQueryRequest';

export default interface VariantsSearchRequestByProductFilterId extends PaginationQueryRequest {
  productFilterId: string;
  size?: number;
}
