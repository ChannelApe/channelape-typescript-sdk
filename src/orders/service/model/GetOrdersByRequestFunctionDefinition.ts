import { Order, OrdersQueryRequestByBusinessId, OrdersQueryRequestByChannel, OrdersQueryRequestByChannelOrderId }
  from '../../..';

type GetOrdersByRequestFunctionDefinition =
  (ordersRequest: OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel |
  OrdersQueryRequestByChannelOrderId, orders: Order[], deferred: Q.Deferred<any>, getSinglePage: boolean) => void;
export default GetOrdersByRequestFunctionDefinition;
