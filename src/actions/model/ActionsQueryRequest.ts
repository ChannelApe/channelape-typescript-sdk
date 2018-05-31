import PaginationQueryRequest from '../../model/PaginationQueryRequest';

export default interface ActionsQueryRequest extends PaginationQueryRequest {
  businessId: string;
}
