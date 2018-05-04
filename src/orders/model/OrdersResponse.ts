import ChannelApeErrorResponse from '../../model/ChannelApeErrorResponse';
import PaginationResponse from '../../model/PaginationResponse';

export default interface OrdersResponse {
  errors: ChannelApeErrorResponse[];
  orders: any[];
  pagination: PaginationResponse;
}
