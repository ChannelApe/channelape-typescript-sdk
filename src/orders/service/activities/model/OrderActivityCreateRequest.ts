import OrderActivityOperation from './OrderActivityOperation';
import OrderActivityResult from './OrderActivityResult';
import OrderActivityMessage from './OrderActivityMessage';

export default interface OrderActivityCreateRequest {
  operation: OrderActivityOperation;
  result: OrderActivityResult;
  completionTime?: Date;
  actionId?: string;
  messages?: OrderActivityMessage[];
}
