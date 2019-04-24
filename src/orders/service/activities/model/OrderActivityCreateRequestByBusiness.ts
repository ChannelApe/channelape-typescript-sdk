import OrderActivityCreateRequest from './OrderActivityCreateRequest';

export default interface OrderActivityCreateRequestByBusiness extends OrderActivityCreateRequest {
  channelOrderId: string;
  businessId: string;
}
