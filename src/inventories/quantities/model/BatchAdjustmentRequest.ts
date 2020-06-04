import AdjustmentsBySku from './AdjustmentsBySku';

export default class BatchAdjustmentRequest {
  public locationId: string;
  public adjustmentsBySku: AdjustmentsBySku[];

  constructor(locationId: string, adjustmentsBySku: AdjustmentsBySku[]) {
    if (typeof locationId !== 'string' || locationId === '') {
      throw new Error('You must provide a location ID');
    }
    if (
      !Array.isArray(adjustmentsBySku) ||
      adjustmentsBySku.length === 0
    ) {
      throw new Error('You must provide an array of at least one AdjustmentBySku object');
    }

    this.locationId = locationId;
    this.adjustmentsBySku = adjustmentsBySku;
  }
}
