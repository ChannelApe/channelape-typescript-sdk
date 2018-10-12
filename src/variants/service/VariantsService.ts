import * as Q from 'q';

import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosRequestConfig } from 'axios';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import GenerateApiError from '../../utils/GenerateApiError';
import Variant from '../model/Variant';
import VariantsRequest from '../model/VariantsRequest';
import VariantsRequestByProductId from '../model/VariantsRequestByProductId';
import VariantApiResponse from '../model/VariantApiResponse';
import VariantsApiResponse from '../model/VariantsApiResponse';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_UPDATE_STATUS = 202;
const PARSE_INT_RADIX = 10;

type GenericVariantsRequest = VariantsRequest & VariantsRequestByProductId;

export default class OrdersService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(variantsRequest: VariantsRequest): Promise<Variant>;
  public get(variantsRequestByProductId: VariantsRequestByProductId): Promise<Variant[]>;
  public get(variantRequest: GenericVariantsRequest): Promise<Variant> | Promise<Variant[]> {
    const deferred: Q.Deferred<Variant[]> = Q.defer<Variant[]>();
    if (variantRequest.skuOrUpc) {
      this.getVariantByRequest(variantRequest, deferred);
    } else {
      this.getVariantsByRequest(variantRequest, [], deferred);
    }
    return deferred.promise as any;
  }

  private getVariantByRequest(variantRequest: VariantsRequest, deferred: Q.Deferred<any>): void {
    const requestUrl =
      `/${Version.V1}${Resource.PRODUCTS}/${variantRequest.productId}${Resource.VARIANTS}/${variantRequest.skuOrUpc}`;
    const options: AxiosRequestConfig = { };
    this.client.get(requestUrl, options, (error, response, body) => {
      const requestResponse: RequestCallbackParams = {
        error,
        response,
        body
      };
      this.mapVariantPromise(requestUrl, deferred, requestResponse, EXPECTED_GET_STATUS);
    });
  }

  private getVariantsByRequest(variantsRequest: VariantsRequestByProductId, variants: Variant[],
    deferred: Q.Deferred<any>): void {
    const requestUrl = `/${Version.V1}${Resource.PRODUCTS}/${variantsRequest.productId}${Resource.VARIANTS}`;
    const options: AxiosRequestConfig = { };
    this.client.get(requestUrl, options, (error, response, body) => {
      const requestResponse: RequestCallbackParams = {
        error,
        response,
        body
      };
      this.mapVariantsPromise(requestUrl, deferred, requestResponse, variants, EXPECTED_GET_STATUS);
    });
  }

  private mapVariantPromise(requestUrl: string, deferred: Q.Deferred<Variant>, requestResponse: RequestCallbackParams,
    expectedStatusCode: number) {
    if (requestResponse.error) {
      deferred.reject(requestResponse.error);
    } else if (requestResponse.response.status === expectedStatusCode) {
      const variant: Variant = this.formatVariant(requestResponse.body);
      deferred.resolve(variant);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, requestResponse.response, requestResponse.body,
        EXPECTED_UPDATE_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapVariantsPromise(
    requestUrl: string,
    deferred: Q.Deferred<any>,
    requestCallbackParams: RequestCallbackParams,
    variants: Variant[],
    expectedStatusCode: number
  ): void {
    if (requestCallbackParams.error) {
      deferred.reject(requestCallbackParams.error);
    } else if (requestCallbackParams.response.status === expectedStatusCode) {
      const data: VariantsApiResponse = requestCallbackParams.body as VariantsApiResponse;
      const mergedVariants: Variant[] = variants.concat(data.variants.map(v => this.formatVariant(v)));
      deferred.resolve(mergedVariants);
    } else {
      const channelApeErrorResponse =
        GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
            EXPECTED_UPDATE_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatVariant(variant: VariantApiResponse): Variant {
    return {
      additionalFields: variant.additionalFields,
      alphabeticCurrencyCode: variant.alphabeticCurrencyCode,
      categories: variant.categories,
      condition: variant.condition,
      createdAt: new Date(variant.createdAt),
      description: variant.description,
      errors: variant.errors,
      grams: parseInt(variant.grams, PARSE_INT_RADIX),
      images: variant.images,
      inventoryItemValue: variant.inventoryItemValue,
      options: variant.options,
      productId: variant.productId,
      quantity: variant.quantity,
      retailPrice: parseFloat(variant.retailPrice),
      sku: variant.sku,
      tags: variant.tags,
      title: variant.title,
      updatedAt: new Date(variant.updatedAt),
      vendor: variant.vendor,
      wholesalePrice: parseFloat(variant.wholesalePrice)
    };
  }
}
