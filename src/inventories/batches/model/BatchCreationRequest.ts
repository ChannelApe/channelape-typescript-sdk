import BatchCreationAdjustment from './BatchCreationAdjustment';

export default interface BatchCreationRequest {
  businessId: string;
  batchId: string;
  adjustments: BatchCreationAdjustment[];
}
