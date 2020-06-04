import AdjustmentsBySku from './AdjustmentsBySku';

export default class BatchAdjustmentRequest {
  public locationId: string;
  public adjustmentsBySku: AdjustmentsBySku[];

  constructor(locationId: string, adjustmentsBySku: AdjustmentsBySku[]) {
    if (typeof locationId !== 'string' || locationId === '') {
      throw new Error('You must provide a location ID');
    }
    if (
      !Array.isArray(adjustmentsBySku)
    ) {
      throw new Error('You must provide an array');
    }

    this.locationId = locationId;
    this.adjustmentsBySku = adjustmentsBySku;
  }
}
