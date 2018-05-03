import OrderStatus from './OrderStatus';

export default interface OrdersRequest {
  status?: OrderStatus;
  size?: number;
  startDate?: Date;
  endDate?: Date;
  lastKey?: string;
}
