import Step from '../../steps/model/Step';
import PlaySchedule from './PlaySchedule';

export default interface Play {
  createdAt: Date;
  id: string;
  name: string;
  steps?: Step[];
  updatedAt: Date;
  scheduleConfigurations?: PlaySchedule[];
}
