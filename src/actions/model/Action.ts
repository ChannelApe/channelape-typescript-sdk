import ActionProcessingStatus from './ActionProcessingStatus';

export default interface Action {
  id: string;
  action: string;
  processingStatus: ActionProcessingStatus;
  targetId: string;
  targetType: string;
  businessId: string;
  description: string;
  healthCheckIntervalInSeconds: number;
  lastHealthCheckTime: Date;
  startTime: Date;
  endTime?: Date;
}
