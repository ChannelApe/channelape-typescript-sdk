import Order from './Order';
import PaginationResponse from '../../model/PaginationResponse';

export default interface OrdersPage {
  orders: Order[];
  pagination: PaginationResponse;
}
