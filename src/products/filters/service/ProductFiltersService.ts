import RequestClientWrapper from '../../../RequestClientWrapper';
import ProductFilterRequest from '../models/ProductFilterRequest';
import ProductFilter from '../models/ProductFilter';
import Version from '../../../model/Version';
import Resource from '../../../model/Resource';
import * as Q from 'q';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import ProductFilterApiResponse from '../models/ProductFilterApiResponse';
import GenerateApiError from '../../../utils/GenerateApiError';

const EXPECTED_CREATE_STATUS = 201;

export default class ProductFiltersService {

  constructor(private readonly client: RequestClientWrapper) { }

  public create(filter: ProductFilterRequest): Promise<ProductFilter> {
    const deferred = Q.defer<ProductFilter>();
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
    deferred: Q.Deferred<ProductFilter>,
    error: any,
    response: AxiosResponse,
    body: any,
    expectedStatusCode: number
  ) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const filter: ProductFilter = this.formatProductFilter(body);
      deferred.resolve(filter);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatProductFilter(filterApiResponse: ProductFilterApiResponse): ProductFilter {
    return <ProductFilter> {
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
      vendors: filterApiResponse.vendors,
      label: filterApiResponse.label,
      title: filterApiResponse.title,
      condition: filterApiResponse.condition,
      primaryCondition: filterApiResponse.primaryCondition,
      secondaryCondition: filterApiResponse.secondaryCondition,
      weightMin: filterApiResponse.weightMin,
      weightMax: filterApiResponse.weightMax,
      retailMin: filterApiResponse.retailMin,
      retailMax: filterApiResponse.retailMax,
      wholesaleMin: filterApiResponse.wholesaleMin,
      wholesaleMax: filterApiResponse.wholesaleMax,
      quantityMin: filterApiResponse.quantityMin,
      quantityMax: filterApiResponse.quantityMax
    };
  }

}
