import { OrdersQueryRequestByBusinessId, OrdersQueryRequestByChannel, OrdersQueryRequestByChannelOrderId }
  from '../../../../src';

type GenericOrdersQueryRequest =
  OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel | OrdersQueryRequestByChannelOrderId;
export default GenericOrdersQueryRequest;
