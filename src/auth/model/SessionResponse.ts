import ChannelApeError from './ChannelApeError';
export default interface SessionResponse {
  sessionId?: string;
  userId?: string;
  errors?: ChannelApeError[];
}
