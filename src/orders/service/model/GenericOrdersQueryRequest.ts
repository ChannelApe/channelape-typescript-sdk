import { OrdersQueryRequestByBusinessId, OrdersQueryRequestByChannel,
  OrdersQueryRequestByChannelOrderId,
  OrdersQueryRequestByPurchaseOrderNumber
}
  from '../../../../src';

type GenericOrdersQueryRequest =
  OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel | OrdersQueryRequestByChannelOrderId
  | OrdersQueryRequestByPurchaseOrderNumber;
export default GenericOrdersQueryRequest;
