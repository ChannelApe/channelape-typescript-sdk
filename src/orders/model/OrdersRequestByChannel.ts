import OrdersRequest from './OrdersRequest';

export default interface OrdersRequestByChannel extends OrdersRequest {
  channelId: string;
}
