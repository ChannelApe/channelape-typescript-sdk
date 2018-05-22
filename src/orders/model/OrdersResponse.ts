import ChannelApeErrorResponse from '../../model/ChannelApeErrorResponse';
import Order from './Order';
import PaginationResponse from '../../model/PaginationResponse';

export default interface OrdersResponse {
  errors: ChannelApeErrorResponse[];
  orders: Order[];
  pagination: PaginationResponse;
}
