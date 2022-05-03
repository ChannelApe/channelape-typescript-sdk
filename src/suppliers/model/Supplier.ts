import FileSettings from '../../model/fileSettings/FileSettings';
import PlaySettings from './PlaySettings';
import StepSettings from './StepSettings';

export default interface Supplier {
  businessId: string;
  createdAt: Date;
  enabled: boolean;
  fileSettings?: FileSettings;
  id: string;
  integrationId: string;
  name: string;
  playSettings?: PlaySettings;
  stepSettings?: StepSettings;
  synchronous?: boolean;
  updatedAt: Date;
}
