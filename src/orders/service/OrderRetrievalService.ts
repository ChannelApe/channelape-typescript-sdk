
import * as Q from 'q';
import Order from '../model/Order';
import * as log4js from 'log4js';
import { Endpoints } from '../../model/Endpoints';
import { Versions } from '../../model/Versions';
import ClientConfiguration from '../../model/ClientConfiguration';
import { Client } from 'node-rest-client';

export default class OrderRetrievalService {
  private logger = log4js.getLogger('OrderRetrievalService');

  constructor(private client: Client, private apiSecret: string, private endpoint: string) {}

  public get(orderId): Promise<Order>  {
    const args = {
      headers: {
        'X-Channel-Ape-Authorization-Token': this.apiSecret
      }
    };

    const requestUrl = `${this.endpoint}/${Versions.V1}${Endpoints.ORDERS}/${orderId}`;
    this.logger.debug(`HTTP Request STARTED: GET ${requestUrl}`);
    return new Promise((resolve, reject) => {
      const req = this.client.get(requestUrl, args, (response: any, data: Order) => {
        this.logger.debug(`HTTP Request FINISHED: GET ${requestUrl}`);
        resolve(data);
      });
      req.on('error', (err) => {
        this.logger.error(`FATAL ERROR making restful request to retrieve: ${requestUrl} - ${err}`);
        reject(err);
      });
    });
  }
}
