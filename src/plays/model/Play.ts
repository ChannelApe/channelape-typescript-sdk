import Step from '../../steps/model/Step';
import PlayScheduleConfiguration from "./PlayScheduleConfiguration";

export default interface Play {
  createdAt: Date;
  id: string;
  name: string;
  steps?: Step[];
  updatedAt: Date;
  scheduleConfigurations?: PlayScheduleConfiguration[];
}
