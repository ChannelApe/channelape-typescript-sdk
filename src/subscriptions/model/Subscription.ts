import ChannelApeApiError from '../../model/ChannelApeApiError';

/**
 * apiRateLimitPerSecond - for internal purpose to startup batch fargate task.
 * userRateLimitPerSecond - for internal purpose to startup batch fargate task.
 */
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
