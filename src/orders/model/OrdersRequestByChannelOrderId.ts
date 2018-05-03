import OrdersRequestByBusinessId from './OrdersRequestByBusinessId';

export default interface OrdersRequestByChannelOrderId extends OrdersRequestByBusinessId {
  channelOrderId: string;
}
