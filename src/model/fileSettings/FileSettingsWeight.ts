import UnitOfMeasurement from '../UnitOfMeasurement';
import FileSettingsMapping from './FileSettingsMapping';

export default interface FileSettingsWeight extends FileSettingsMapping {
  unitOfMeasurement: UnitOfMeasurement;
}
