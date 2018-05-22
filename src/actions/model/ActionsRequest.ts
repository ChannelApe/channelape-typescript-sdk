import PaginationQueryRequest from '../../model/PaginationQueryRequest';

export default interface ActionsRequest extends PaginationQueryRequest {
  businessId: string;
}
