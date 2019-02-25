import OrdersQueryRequestByBusinessId from './OrdersQueryRequestByBusinessId';

export default interface OrdersQueryRequestByChannelOrderId extends OrdersQueryRequestByBusinessId{
  channelOrderId: string;
}
