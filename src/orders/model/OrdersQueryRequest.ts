import PaginationQueryRequest from '../../model/PaginationQueryRequest';
import OrderStatus from './OrderStatus';

export default interface OrdersQueryRequest extends PaginationQueryRequest {
  status?: OrderStatus;
  count?: number;
}
