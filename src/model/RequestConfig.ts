import { RequestCallback } from './RequestCallback';
import { AxiosRequestConfig } from 'axios';
import HttpRequestMethod from './HttpRequestMethod';

export interface RequestConfig {
  method: HttpRequestMethod;
  url: string;
  params: AxiosRequestConfig;
  callback: RequestCallback;
}
