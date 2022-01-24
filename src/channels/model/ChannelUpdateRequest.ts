import Channel from './Channel';

export default interface ChannelUpdateRequest extends Partial<Channel>{
  credentials: object;
}
