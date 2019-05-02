import OrderActivityCreateRequest from './OrderActivityCreateRequest';

export default interface OrderActivityCreateRequestByChannel extends OrderActivityCreateRequest {
  channelOrderId: string;
  channelId: string;
}
