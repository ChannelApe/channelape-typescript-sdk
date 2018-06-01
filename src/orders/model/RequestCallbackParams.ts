import ChannelApeApiErrorResponse from './../../model/ChannelApeApiErrorResponse';
import OrdersPage from '../model/OrdersPage';
import * as request from 'request';

export default interface RequestCallbackParams {
  error: any;
  response: request.Response;
  body: OrdersPage | ChannelApeApiErrorResponse;
}
