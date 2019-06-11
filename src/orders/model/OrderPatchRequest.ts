import Order from './Order';

export default interface OrderPatchRequest extends Partial<Order> {
  actionId?: string;
  channelSync?: boolean;
}
