import { AxiosResponse } from '../../node_modules/axios';

export type RequestCallback = (error: any, response: AxiosResponse, body: any) => void;
