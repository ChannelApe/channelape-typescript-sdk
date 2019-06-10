import Order from './Order';
import { RecursivePartial } from '../../model/RecursivePartial';

export default interface OrderPatchRequest extends RecursivePartial<Order> {
  actionId?: string;
}
