import { AxiosResponse } from 'axios';

export default interface RequestCallbackParams {
  error: any;
  response: AxiosResponse;
  body: any;
}
