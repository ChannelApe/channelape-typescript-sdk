import RequestClientWrapper from '../../../RequestClientWrapper';
import ProductsFilterRequest from '../models/ProductsFilterRequest';
import ProductsFilter from '../models/ProductsFilter';
import Version from '../../../model/Version';
import Resource from '../../../model/Resource';
import * as Q from 'q';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import ProductsFilterApiResponse from '../models/ProductsFilterApiResponse';
import GenerateApiError from '../../../utils/GenerateApiError';

const EXPECTED_CREATE_STATUS = 201;

export default class ProductsFiltersService {

  constructor(private readonly client: RequestClientWrapper) { }

  public create(filter: ProductsFilterRequest): Promise<ProductsFilter> {
    const deferred = Q.defer<ProductsFilter>();
    const requestUrl = `${Version.V1}${Resource.PRODUCTS}${Resource.FILTERS}`;
    const options: AxiosRequestConfig = {
      data: filter
    };

    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapFilterPromise(requestUrl, deferred, error, response, body, EXPECTED_CREATE_STATUS);
    });
    return deferred.promise as any;
  }

  private mapFilterPromise(
    requestUrl: string,
    deferred: Q.Deferred<ProductsFilter>,
    error: any,
    response: AxiosResponse,
    body: any,
    expectedStatusCode: number
  ) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const filter: ProductsFilter = this.formatProductsFilter(body);
      deferred.resolve(filter);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatProductsFilter(filterApiResponse: ProductsFilterApiResponse): ProductsFilter {
    return <ProductsFilter> {
      id: filterApiResponse.id,
      alphabeticCurrencyCode: filterApiResponse.alphabeticCurrencyCode,
      businessId: filterApiResponse.businessId,
      complement: filterApiResponse.complement,
      createdAt: new Date(filterApiResponse.createdAt),
      errors: filterApiResponse.errors,
      skus: filterApiResponse.skus,
      tags: filterApiResponse.tags,
      upcs: filterApiResponse.upcs,
      updatedAt: new Date(filterApiResponse.updatedAt),
      vendors: filterApiResponse.vendors
    };
  }

}
