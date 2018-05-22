import OrdersQueryRequest from './OrdersQueryRequest';

export default interface OrdersRequestByChannel extends OrdersQueryRequest {
  channelId: string;
}
