import OrdersQueryRequest from './OrdersQueryRequest';

export default interface OrdersQueryRequestByBusinessId extends OrdersQueryRequest {
  businessId: string;
}
