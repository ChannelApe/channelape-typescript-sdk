import Order from './Order';

export default interface OrderUpdateRequest extends Order {
  actionId?: string;
  channelSync?: boolean;
}
