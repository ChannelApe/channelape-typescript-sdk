import OrderActivityCreateRequest from './OrderActivityCreateRequest';

export default interface OrderActivityCreateRequestByOrderId extends OrderActivityCreateRequest {
  orderId: string;
}
