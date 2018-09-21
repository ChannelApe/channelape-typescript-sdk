import PaginationQueryRequest from '../../model/PaginationQueryRequest';

export default interface ChannelsQueryRequestByBusinessId extends PaginationQueryRequest {
  businessId: string;
}
