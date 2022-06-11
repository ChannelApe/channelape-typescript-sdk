import * as Q from 'q';
import Subscription from './../model/Subscription';
import ChannelApeApiErrorResponse from './../../model/ChannelApeApiErrorResponse';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';

export default class SubscriptionsService {

  constructor(private readonly client: RequestClientWrapper) { }

  get(businessId: string): Q.Promise<Subscription> {
    const deferred = Q.defer<Subscription>();
    const requestUrl = `/${Version.V1}${Resource.SUBSCRIPTIONS}/${businessId}`;

    this.client.get(requestUrl, {}, (error, response, body) => {
      if (error) {
        deferred.reject(error);
      } else if (response.status === 200) {
        deferred.resolve(this.formatSubscription(body));
      } else {
        const channelApeApiErrorResponse = body as ChannelApeApiErrorResponse;
        channelApeApiErrorResponse.statusCode = response.status;
        deferred.reject(channelApeApiErrorResponse);
      }
    });
    return deferred.promise;
  }

  private formatSubscription(subscriptionResponse: any): Subscription {
    const subscription: Subscription = {
      errors: subscriptionResponse.errors
    };
    subscription.active = subscriptionResponse.active;
    subscription.businessId = subscriptionResponse.businessId;
    subscription.subscriptionId = subscriptionResponse.subscriptionId;
    subscription.subscriptionProductHandle = subscriptionResponse.subscriptionProductHandle;
    subscription.apiRateLimitPerSecond = subscriptionResponse.apiRateLimitPerSecond;
    subscription.userRateLimitPerSecond = subscriptionResponse.userRateLimitPerSecond;

    if (subscriptionResponse.createdAt) {
      subscription.createdAt = new Date(subscriptionResponse.createdAt);
    }
    if (subscriptionResponse.lastCompletedTaskUsageRecordingTime) {
      subscription.lastCompletedTaskUsageRecordingTime =
        new Date(subscriptionResponse.lastCompletedTaskUsageRecordingTime);
    }
    if (subscriptionResponse.periodEndsAt) {
      subscription.periodEndsAt = new Date(subscriptionResponse.periodEndsAt);
    }
    if (subscriptionResponse.periodStartedAt) {
      subscription.periodStartedAt = new Date(subscriptionResponse.periodStartedAt);
    }
    if (subscriptionResponse.updatedAt) {
      subscription.updatedAt = new Date(subscriptionResponse.updatedAt);
    }
    return subscription;
  }

}
