import ChannelApeError from './ChannelApeError';
export default interface ChannelApeErrorResponse {
  statusCode: number;
  errors: ChannelApeError[];
}
