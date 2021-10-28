import Business, { BusinessMembers } from '../model/Business';
import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import GenerateApiError from '../../utils/GenerateApiError';
import BusinessesQueryRequestByUserId from '../model/BusinessesQueryRequestByUserId';
import BusinessesQueryRequestByBusinessId from '../model/BusinessesQueryRequestByBusinessId';
import * as Q from 'q';
import BusinessCreateRequest from '../model/BusinessCreateRequest';
import { BusinessMemberRequest } from '../model/BusinessMemberRequest';
import { BusinessMember } from '../model/BusinessMember';
import InvitationResponse from '../model/InvitationResponse';
import RemoveMember from '../model/RemoveMember';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_CREATE_STATUS = 201;

export default class BusinessesCrudService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(request: BusinessesQueryRequestByUserId): Promise<Business[]>;
  public get(request: BusinessesQueryRequestByBusinessId): Promise<Business>;
  public get(
    request: BusinessesQueryRequestByUserId & BusinessesQueryRequestByBusinessId
  ): Promise<Business[]> | Promise<Business> {
    const deferred = Q.defer<Business[] | Business>();
    let requestUrl = `/${Version.V1}${Resource.BUSINESSES}`;
    let requestOptions: AxiosRequestConfig = {};
    if (request.userId) {
      requestOptions = { params: request };
    } else {
      requestUrl += `/${request.businessId}`;
    }
    this.client.get(requestUrl, requestOptions, (error, response, body) => {
      this.mapBusinessesPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  public getBusinessMember(request: BusinessMemberRequest): Promise<BusinessMember> {
    const deferred = Q.defer<Business | BusinessMember>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}`;
    const requestOptions: AxiosRequestConfig = {
      params: {
        businessId: request.businessId,
        userId: request.userId
      }
    };
    this.client.get(requestUrl, requestOptions, (error, response, body) => {
      this.mapBusinessPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  public getBusinessMembers(request: BusinessMemberRequest): Promise<BusinessMembers> {
    const deferred = Q.defer<BusinessMembers | BusinessMembers[]>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/?businessId=${request.businessId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapBusinessPromises(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  public verifyBusinessMember(verificationCode: string): Promise<Business> {
    const deferred = Q.defer<Business | BusinessMember>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESS_MEMBER_VERIFICATIONS}/${verificationCode}`;
    const requestOptions: AxiosRequestConfig = {};
    this.client.get(requestUrl, requestOptions, (error, response, body) => {
      this.mapBusinessPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  public create(business: BusinessCreateRequest): Promise<Business> {
    const deferred = Q.defer<Business | BusinessMember>();
    const requestUrl = `${Version.V1}${Resource.BUSINESSES}`;
    const options: AxiosRequestConfig = {
      data: business
    };
    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapBusinessPromise(requestUrl, deferred, error, response, body, EXPECTED_CREATE_STATUS);
    });
    return deferred.promise as any;
  }
  public inviteMember(email:string, businessId:string):Promise<InvitationResponse>  {
    const deferred = Q.defer<Business | BusinessMember>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/${businessId}/members`;
    const options: AxiosRequestConfig = {
      data: JSON.stringify({
        username: email
      })
    };
    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapBusinessPromise(requestUrl, deferred, error, response, body, EXPECTED_CREATE_STATUS);
    });
    return deferred.promise as any;
  }
  public removeMember(businessId:string, userId:string):Promise<RemoveMember>  {
    const deferred = Q.defer<Business | BusinessMember>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/${businessId}/members/${userId}`;
    this.client.delete(requestUrl, {}, (error, response, body) => {
      this.mapBusinessPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  public update(business: BusinessCreateRequest): Promise<Business> {
    const deferred = Q.defer<Business | BusinessMember>();
    const requestUrl = `${Version.V1}${Resource.BUSINESSES}`;
    const options: AxiosRequestConfig = {
      data: business
    };
    this.client.put(requestUrl, options, (error, response, body) => {
      this.mapBusinessPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private mapBusinessesPromise(requestUrl: string, deferred: Q.Deferred<Business[] | Business>, error: any,
    response: AxiosResponse, body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      if (body.businesses) {
        const businesses: Business[] = body.businesses;
        deferred.resolve(businesses);
      } else {
        const business: Business = body;
        deferred.resolve(business);
      }
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapBusinessPromise(
    requestUrl: string,
    deferred: Q.Deferred<Business | BusinessMember>,
    error: any,
    response: AxiosResponse,
    body: any,
    expectedStatusCode: number
  ) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      deferred.resolve(body);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }
  private mapBusinessPromises(
      requestUrl: string,
      deferred: Q.Deferred<BusinessMembers | BusinessMembers[]>,
      error: any,
      response: AxiosResponse,
      body: any,
      expectedStatusCode: number
  ) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      deferred.resolve(body);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

}
