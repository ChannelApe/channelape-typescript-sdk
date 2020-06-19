import AdjustmentBySku from './AdjustmentBySku';

export default interface AdjustmentsBySku {
  sku: string;
  adjustments: AdjustmentBySku[];
}
