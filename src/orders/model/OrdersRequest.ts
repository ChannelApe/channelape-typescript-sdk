import PaginationRequest from '../../model/PaginationRequest';
import OrderStatus from './OrderStatus';

export default interface OrdersRequest extends PaginationRequest {
  status?: OrderStatus;
}
