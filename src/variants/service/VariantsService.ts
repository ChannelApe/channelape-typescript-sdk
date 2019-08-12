import * as Q from 'q';

import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosRequestConfig } from 'axios';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import GenerateApiError from '../../utils/GenerateApiError';
import Variant from '../model/Variant';
import VariantSearchDetails from '../model/VariantSearchDetails';
import VariantsRequest from '../model/VariantsRequest';
import VariantsRequestByProductId from '../model/VariantsRequestByProductId';
import VariantApiResponse from '../model/VariantApiResponse';
import VariantsApiResponse from '../model/VariantsApiResponse';
import VariantSearchApiResponse from '../model/VariantSearchApiResponse';
import VariantSearchDetailsApiResponse from '../model/VariantSearchDetailsApiResponse';
import VariantsSearchRequestByProductFilterId from '../model/VariantsSearchRequestByProductFilterId';
import VariantsSearchRequestBySku from '../model/VariantsSearchRequestBySku';
import VariantsSearchRequestByUpc from '../model/VariantsSearchRequestByUpc';
import VariantsSearchRequestByVendor from '../model/VariantsSearchRequestByVendor';
import VariantsSearchRequestByTag from '../model/VariantsSearchRequestByTag';
import VariantsPage from '../model/VariantsPage';

const EXPECTED_GET_STATUS = 200;
const PARSE_INT_RADIX = 10;

type GenericVariantsRequest = VariantsRequest & VariantsRequestByProductId;

type GenericVariantsSearchRequest =
  VariantsSearchRequestByProductFilterId & VariantsSearchRequestBySku &
  VariantsSearchRequestByUpc & VariantsSearchRequestByVendor & VariantsSearchRequestByTag;

export default class VariantsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(variantsRequest: VariantsRequest): Promise<Variant>;
  public get(variantsRequestByProductId: VariantsRequestByProductId): Promise<Variant[]>;
  public get(variantRequest: GenericVariantsRequest): Promise<Variant> | Promise<Variant[]> {
    const deferred: Q.Deferred<Variant[]> = Q.defer<Variant[]>();
    if (variantRequest.inventoryItemValue) {
      this.getVariantByRequest(variantRequest, deferred);
    } else {
      this.getVariantsByRequest(variantRequest, [], deferred);
    }
    return deferred.promise as any;
  }

  public search(variantsSearchRequestByProductFilterId: VariantsSearchRequestByProductFilterId):
    Promise<VariantSearchDetails[]>;
  public search(variantsSearchRequestBySku: VariantsSearchRequestBySku): Promise<VariantSearchDetails[]>;
  public search(variantsSearchRequestByUpc: VariantsSearchRequestByUpc): Promise<VariantSearchDetails[]>;
  public search(variantsSearchRequestByVendor: VariantsSearchRequestByVendor): Promise<VariantSearchDetails[]>;
  public search(variantsSearchRequestByTag: VariantsSearchRequestByTag): Promise<VariantSearchDetails[]>;
  public search(variantSearchRequest: GenericVariantsSearchRequest): Promise<VariantSearchDetails[]> {
    const deferred: Q.Deferred<VariantSearchDetails[]> = Q.defer<VariantSearchDetails[]>();
    const getSinglePage = false;
    this.getVariantSearchResultsByRequest(variantSearchRequest, [], deferred, getSinglePage);
    return deferred.promise as any;
  }

  public getPage(variantsSearchRequestByProductFilterId: VariantsSearchRequestByProductFilterId):
    Promise<VariantsPage>;
  public getPage(variantsSearchRequestBySku: VariantsSearchRequestBySku): Promise<VariantsPage>;
  public getPage(variantsSearchRequestByUpc: VariantsSearchRequestByUpc): Promise<VariantsPage>;
  public getPage(variantsSearchRequestByVendor: VariantsSearchRequestByVendor): Promise<VariantsPage>;
  public getPage(variantsSearchRequestByTag: VariantsSearchRequestByTag): Promise<VariantsPage>;
  public getPage(variantSearchRequest: GenericVariantsSearchRequest): Promise<VariantsPage> {
    const deferred: Q.Deferred<VariantsPage> = Q.defer<VariantsPage>();
    const getSinglePage = true;
    this.getVariantSearchResultsByRequest(variantSearchRequest, [], deferred, getSinglePage);
    return deferred.promise as any;
  }

  private getVariantSearchResultsByRequest(
    variantSearchRequest: GenericVariantsSearchRequest,
    variantSearchDetails: VariantSearchDetails[],
    deferred: Q.Deferred<any>,
    getSinglePage: boolean
  ): void {
    let requestUrl = `${Version.V1}${Resource.PRODUCTS}${Resource.VARIANTS}`;
    if (variantSearchRequest.vendor) {
      requestUrl += Resource.VENDORS;
    }
    if (variantSearchRequest.sku) {
      requestUrl += Resource.SKUS;
    }
    if (variantSearchRequest.upc) {
      requestUrl += Resource.UPCS;
    }
    if (variantSearchRequest.tag) {
      requestUrl += Resource.TAGS;
    }
    const options: AxiosRequestConfig = {
      params: variantSearchRequest
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      const requestResponse: RequestCallbackParams = {
        error,
        response,
        body
      };
      this.mapVariantsSearchPromise(requestUrl, deferred, requestResponse, variantSearchDetails, variantSearchRequest,
        EXPECTED_GET_STATUS, getSinglePage);
    });
    return deferred.promise as any;
  }

  private getVariantByRequest(variantRequest: VariantsRequest, deferred: Q.Deferred<any>): void {
    const requestUrl = `/${Version.V1}${Resource.PRODUCTS}/${variantRequest.productId}${Resource.VARIANTS}/` +
      `${encodeURIComponent(variantRequest.inventoryItemValue)}`;
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
        EXPECTED_GET_STATUS);
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
          EXPECTED_GET_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapVariantsSearchPromise(
    requestUrl: string,
    deferred: Q.Deferred<any>, requestCallbackParams: RequestCallbackParams,
    variantDetails: VariantSearchDetails[],
    variantsRequest: GenericVariantsSearchRequest,
    expectedStatusCode: number,
    getSinglePage: boolean
  ): void {
    if (requestCallbackParams.error) {
      deferred.reject(requestCallbackParams.error);
    } else if (requestCallbackParams.response.status === expectedStatusCode) {
      const data: VariantSearchApiResponse = requestCallbackParams.body as VariantSearchApiResponse;
      const variantSearchResults = data.variantSearchResults.map(vs => this.formatVariantSearchDetails(vs));
      const mergedVariantDetails: VariantSearchDetails[] = variantDetails.concat(variantSearchResults);
      if (getSinglePage) {
        deferred.resolve({
          variantSearchResults: mergedVariantDetails,
          pagination: data.pagination
        });
      } else if (data.pagination.lastPage) {
        const variantSearchDetailsToReturn = mergedVariantDetails;
        deferred.resolve(variantSearchDetailsToReturn);
      } else {
        const newVariantsRequest: GenericVariantsSearchRequest = {
          ...variantsRequest,
          lastKey: data.pagination.lastKey
        };
        this.getVariantSearchResultsByRequest(newVariantsRequest, mergedVariantDetails, deferred, getSinglePage);
      }
    } else {
      const channelApeErrorResponse =
        GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
            EXPECTED_GET_STATUS);
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
      sku: variant.sku ? variant.sku : '',
      upc: variant.upc ? variant.upc : '',
      tags: variant.tags,
      title: variant.title,
      updatedAt: new Date(variant.updatedAt),
      vendor: variant.vendor,
      wholesalePrice: parseFloat(variant.wholesalePrice)
    };
  }

  private formatVariantSearchDetails(variantSearchDetails: VariantSearchDetailsApiResponse): VariantSearchDetails {
    return {
      businessId: variantSearchDetails.businessId,
      condition: variantSearchDetails.condition,
      currencyCode: variantSearchDetails.currencyCode,
      grams: parseInt(variantSearchDetails.grams, PARSE_INT_RADIX),
      inventoryItemValue: variantSearchDetails.inventoryItemValue,
      primaryCategory: variantSearchDetails.primaryCategory,
      productId: variantSearchDetails.productId,
      quantity: variantSearchDetails.quantity,
      retailPrice: parseFloat(variantSearchDetails.retailPrice),
      sku: variantSearchDetails.sku,
      tags: variantSearchDetails.tags,
      title: variantSearchDetails.title,
      upc: variantSearchDetails.upc,
      vendor: variantSearchDetails.vendor,
      wholesalePrice: parseFloat(variantSearchDetails.wholesalePrice)
    };
  }
}
