import OrderActivityOperation from './OrderActivityOperation';
import OrderActivityResult from './OrderActivityResult';
import OrderActivityMessage from './OrderActivityMessage';

export default interface OrderActivity {
  operation: OrderActivityOperation;
  result: OrderActivityResult;
  orderId: string;
  channelId: string;
  completionTime: Date;
  actionId: string;
  messages: OrderActivityMessage[];
}
