import OrdersRequest from './OrdersRequest';

export default interface OrderRequestByBusinessId extends OrdersRequest {
  businessId: string;
}
