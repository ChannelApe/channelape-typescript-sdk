import PaginationRequest from '../../model/PaginationRequest';

export default interface ActionsRequest extends PaginationRequest {
  businessId: string;
}
