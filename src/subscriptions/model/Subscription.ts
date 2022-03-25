import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface Subscription {
  active?: boolean;
  businessId?: string;
  createdAt?: Date;
  errors: ChannelApeApiError[];
  lastCompletedTaskUsageRecordingTime?: Date;
  periodEndsAt?: Date;
  periodStartedAt?: Date;
  subscriptionId?: string;
  subscriptionProductHandle?: string;
  updatedAt?: Date;
  apiRateLimitPerSecond?: number;
  userRateLimitPerSecond?: number;
}
