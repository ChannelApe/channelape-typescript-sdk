import OutputFileColumnField from './OutputFileColumnField';
import UnitOfMeasurement from '../../model/UnitOfMeasurement';

export default interface OutputFileColumn {
  header: boolean;
  field?: OutputFileColumnField;
  index?: number;
  value?: string;
  unitOfMeasurement?: UnitOfMeasurement;
}
