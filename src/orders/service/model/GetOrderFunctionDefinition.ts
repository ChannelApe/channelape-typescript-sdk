import { Order, OrdersQueryRequestByBusinessId, OrdersQueryRequestByChannel, OrdersQueryRequestByChannelOrderId }
  from '../../../../src';

type GetOrderByOrderIdFunctionDefinition =
  (orderId: string) => Promise<Order>;
type GetOrderByBusinessIdFunctionDefinition =
  (ordersRequestByBusinessId: OrdersQueryRequestByBusinessId) => Promise<Order[]>;
type GetOrderByChannelIdFunctionDefinition =
  (ordersRequestByChannel: OrdersQueryRequestByChannel) => Promise<Order[]>;
type GetOrderByChannelOrderIdFunctionDefinition =
  (ordersRequestByChannelOrderId: OrdersQueryRequestByChannelOrderId) => Promise<Order[]>;

type GetOrderFunctionDefinition =
  GetOrderByOrderIdFunctionDefinition &
  GetOrderByBusinessIdFunctionDefinition &
  GetOrderByChannelIdFunctionDefinition &
  GetOrderByChannelOrderIdFunctionDefinition;

export default GetOrderFunctionDefinition;
