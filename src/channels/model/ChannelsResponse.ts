import Channel from './Channel';
import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface ChannelsResponse {
  channels: Channel[];
  errors: ChannelApeApiError[];
}
