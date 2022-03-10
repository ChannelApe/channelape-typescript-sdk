import OrderStatus from '../../orders/model/OrderStatus';

export default interface OrderQueryParameters {
  purchasedAtMaxIntervalMinutes: string;
  purchasedAtMinIntervalMinutes: string;
  status?: OrderStatus;
  updatedAtMaxIntervalMinutes?: string;
  updatedAtMinIntervalMinutes?: string;
  channelIds?: string[];
  statuses?: OrderStatus[];
}
