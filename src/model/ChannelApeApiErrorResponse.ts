import ChannelApeApiError from './ChannelApeApiError';
export default interface ChannelApeErrorResponse {
  statusCode: number;
  errors: ChannelApeApiError[];
}
