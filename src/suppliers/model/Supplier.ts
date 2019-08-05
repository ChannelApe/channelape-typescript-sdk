import FileSettings from '../../model/fileSettings/FileSettings';

export default interface Supplier {
  businessId: string;
  createdAt: Date;
  enabled: boolean;
  fileSettings?: FileSettings;
  id: string;
  integrationId: string;
  name: string;
  updatedAt: Date;
}
