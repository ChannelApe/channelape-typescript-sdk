import { AxiosResponse } from 'axios';

export type RequestCallback = (error: any, response: AxiosResponse, body: any) => void;
