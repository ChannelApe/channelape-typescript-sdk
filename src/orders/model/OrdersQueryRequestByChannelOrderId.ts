import OrdersQueryRequestByBusinessId from './OrdersQueryRequestByBusinessId';

export default interface OrdersRequestByChannelOrderId extends OrdersQueryRequestByBusinessId {
  channelOrderId: string;
}
