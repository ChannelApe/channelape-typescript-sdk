import FileSettings from '../../model/fileSettings/FileSettings';
import PlaySettings from './PlaySettings';
import StepSettings from './StepSettings';

export default interface SupplierCreateRequest {
  businessId: string;
  enabled: boolean;
  fileSettings?: FileSettings;
  integrationId: string;
  name: string;
  stepSettings?: StepSettings;
  playSettings?: PlaySettings;
  synchronous?: boolean;
}
