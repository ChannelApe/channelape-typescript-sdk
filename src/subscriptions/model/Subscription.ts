import ChannelApeApiError from '../../model/ChannelApeApiError';

/**
 * @property {number} apiRateLimitPerSecond - for internal purpose to startup batch fargate task.
 * @property {number} userRateLimitPerSecond - for internal purpose to startup batch fargate task.
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
