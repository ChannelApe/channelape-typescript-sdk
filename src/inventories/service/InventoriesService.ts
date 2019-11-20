import RequestClientWrapper from '../../RequestClientWrapper';
import * as Q from 'q';
import Version from '../../model/Version';
import Resource from '../../model/Resource';
import RestService from '../../service/RestService';
import InventoryItem from '../model/InventoryItem';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import InventoryItemsResponse from '../model/InventoryItemsResponse';
import GenerateApiError from '../../utils/GenerateApiError';
import { AxiosRequestConfig } from 'axios';

export default class InventoriesService extends RestService {

  private readonly EXPECTED_GET_STATUS = 200;

  constructor(private readonly client: RequestClientWrapper) {
    super();
  }

  public get(businessId: string, sku: string): Promise<InventoryItem[]>;
  public get(inventoryItemId: string): Promise<InventoryItem>;
  public get(inventoryItemIdOrBusinessId: string, sku?: string): Promise<InventoryItem | InventoryItem[]> {
    if (sku) {
      return this.retrieveInventoryItemByBusinessAndSku(sku, inventoryItemIdOrBusinessId);
    }
    return this.retrieveInventoryItemById(inventoryItemIdOrBusinessId);
  }

  private retrieveInventoryItemById(inventoryItemIdOrBusinessId: string) {
    const deferred = Q.defer<InventoryItem>();
    const requestUrl = `/${Version.V1}${Resource.INVENTORIES}/${inventoryItemIdOrBusinessId}`;
    this.client.get(requestUrl, {}, (error, response, body) =>
      this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_GET_STATUS));
    return deferred.promise as any;
  }

  private retrieveInventoryItemByBusinessAndSku(sku: string | undefined, inventoryItemIdOrBusinessId: string)
    : Promise<InventoryItem | InventoryItem[]> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.INVENTORIES}`;
      const options: AxiosRequestConfig = {
        params: {
          sku,
          businessId: inventoryItemIdOrBusinessId
        }
      };
      this.client.get(requestUrl, options, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapInventoryItemsPromise(requestUrl, requestResponse, this.EXPECTED_GET_STATUS));
      });
    });
  }

  private mapInventoryItemsPromise(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<InventoryItem[]> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        const data: InventoryItemsResponse = requestCallbackParams.body as InventoryItemsResponse;
        resolve(data.inventoryItems.map(inventoryItem => this.formatChannel(inventoryItem)));
      } else {
        const channelApeErrorResponse =
          GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
            this.EXPECTED_GET_STATUS);
        reject(channelApeErrorResponse);
      }
    });
  }

  private formatChannel(inventoryItem: any): InventoryItem {
    inventoryItem.createdAt = new Date(inventoryItem.createdAt);
    inventoryItem.updatedAt = new Date(inventoryItem.updatedAt);
    return inventoryItem as InventoryItem;
  }

}
