import Step from '../../steps/model/Step';

export default interface Play {
  createdAt: Date;
  id: string;
  name: string;
  steps: Step[];
  updatedAt: Date;
}
