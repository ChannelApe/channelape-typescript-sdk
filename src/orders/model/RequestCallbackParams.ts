import ChannelApeApiErrorResponse from './../../model/ChannelApeApiErrorResponse';
import Orders from '../model/Orders';
import * as request from 'request';

export default interface RequestCallbackParams {
  error: any;
  response: request.Response;
  body: Orders | ChannelApeApiErrorResponse;
}
