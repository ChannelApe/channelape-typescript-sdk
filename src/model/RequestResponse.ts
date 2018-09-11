import { AxiosResponse } from 'axios';

export default interface RequestResponse {
  error: Error | undefined;
  response: AxiosResponse | undefined;
  body: any;
  code?: string;
}
