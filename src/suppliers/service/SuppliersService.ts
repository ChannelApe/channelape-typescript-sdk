import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as Q from 'q';

import Resource from '../../model/Resource';
import Supplier from '../model/Supplier';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';
import SuppliersQueryRequestByBusinessId from '../model/SuppliersQueryRequestByBusinessId';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import SuppliersResponse from '../model/SuppliersResponse';
import GenerateApiError from '../../utils/GenerateApiError';
import SupplierUpdateRequest from '../model/SupplierUpdateRequest';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_PUT_STATUS = 200;

export default class SuppliersService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(supplierId: string): Promise<Supplier>;
  public get(suppliersQueryRequestByBusinessId: SuppliersQueryRequestByBusinessId): Promise<Supplier[]>;
  public get(supplierIdOrRequest: string | SuppliersQueryRequestByBusinessId):
    Promise<Supplier> | Promise<Supplier[]> {
    if (typeof supplierIdOrRequest === 'string') {
      return this.getSupplierById(supplierIdOrRequest);
    }
    return this.getSuppliersByRequest(supplierIdOrRequest);
  }

  public update(supplier: SupplierUpdateRequest): Promise<Supplier> {
    const deferred = Q.defer<Supplier>();
    const requestUrl = `/${Version.V1}${Resource.SUPPLIERS}/${supplier.id}`;
    this.client.put(requestUrl, { data: supplier }, (error, response, body) => {
      this.mapSupplierPromise(requestUrl, deferred, error, response, body, EXPECTED_PUT_STATUS);
    });
    return deferred.promise as any;
  }

  private getSupplierById(supplierId: string): Promise<Supplier> {
    const deferred = Q.defer<Supplier>();
    const requestUrl = `/${Version.V1}${Resource.SUPPLIERS}/${supplierId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapSupplierPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private getSuppliersByRequest(suppliersRequest: SuppliersQueryRequestByBusinessId): Promise<Supplier[]> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.SUPPLIERS}`;
      const options: AxiosRequestConfig = {
        params: suppliersRequest
      };
      this.client.get(requestUrl, options, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapSuppliersPromise(requestUrl, requestResponse, EXPECTED_GET_STATUS));
      });
    });
  }

  private mapSupplierPromise(requestUrl: string, deferred: Q.Deferred<Supplier>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const supplier: Supplier = this.formatSupplier(body);
      deferred.resolve(supplier);
    } else {
      const supplierApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(supplierApeErrorResponse);
    }
  }

  private mapSuppliersPromise(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<Supplier[]> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        const data: SuppliersResponse = requestCallbackParams.body as SuppliersResponse;
        resolve(data.suppliers.map(supplier => this.formatSupplier(supplier)));
      } else {
        const supplierApeErrorResponse =
          GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
              EXPECTED_GET_STATUS);
        reject(supplierApeErrorResponse);
      }
    });
  }

  private formatSupplier(supplier: any): Supplier {
    supplier.createdAt = new Date(supplier.createdAt);
    supplier.updatedAt = new Date(supplier.updatedAt);
    return supplier as Supplier;
  }
}
