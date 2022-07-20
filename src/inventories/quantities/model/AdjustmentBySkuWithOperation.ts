import { AdjustmentType } from '../../enum/AdjustmentType';
import AdjustmentBySku from './AdjustmentBySku';

export default interface AdjustmentBySkuWithOperation extends AdjustmentBySku {
  operation: AdjustmentType;
}
