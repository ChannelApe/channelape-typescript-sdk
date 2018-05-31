import Order from './Order';
import PaginationResponse from '../../model/PaginationResponse';

export default interface Orders {
  orders: Order[];
  pagination: PaginationResponse;
}
