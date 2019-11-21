import RequestClientWrapper from '../../RequestClientWrapper';
import * as Q from 'q';
import Version from '../../model/Version';
import Resource from '../../model/Resource';
import RestService from '../../service/RestService';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import GenerateApiError from '../../utils/GenerateApiError';
import Location from './../model/Location';
import LocationsResponse from './../model/LocationsResponse';
import LocationCreateRequest from '../model/LocationCreateRequest';
import LocationUpdateRequest from './../model/LocationUpdateRequest';

export default class LocationsService extends RestService {

  private readonly EXPECTED_GET_OR_UPDATE_STATUS = 200;
  private readonly EXPECTED_CREATE_STATUS = 201;

  constructor(private readonly client: RequestClientWrapper) {
    super();
  }

  public create(locationCreationRequest: LocationCreateRequest): Promise<Location> {
    const deferred = Q.defer<Location>();
    const requestUrl = `/${Version.V1}${Resource.LOCATIONS}`;
    const options = {
      data: locationCreationRequest
    };
    this.client.post(requestUrl, options, (error, response, body) =>
      this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_CREATE_STATUS));
    return deferred.promise as any;
  }

  public update(locationUpdateRequest: LocationUpdateRequest): Promise<Location> {
    const deferred = Q.defer<Location>();
    const requestUrl = `/${Version.V1}${Resource.LOCATIONS}/${locationUpdateRequest.id}`;
    const options = {
      data: locationUpdateRequest
    };
    this.client.put(requestUrl, options, (error, response, body) => {
      return this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_GET_OR_UPDATE_STATUS);
    });
    return deferred.promise as any;
  }

  public get(locationId: string): Promise<Location> {
    const deferred = Q.defer<Location>();
    const requestUrl = `/${Version.V1}${Resource.LOCATIONS}/${locationId}`;
    this.client.get(requestUrl, {}, (error, response, body) =>
      this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_GET_OR_UPDATE_STATUS));
    return deferred.promise as any;
  }

  public getByBusinessId(businessId: string): Promise<Location[]> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.LOCATIONS}?businessId=${businessId}`;
      this.client.get(requestUrl, {}, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapLocationsResponse(requestUrl, requestResponse, this.EXPECTED_GET_OR_UPDATE_STATUS));
      });
    });
  }

  private mapLocationsResponse(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<Location[]> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        const data: LocationsResponse = requestCallbackParams.body as LocationsResponse;
        resolve(data.locations.map(location => this.formatLocation(location)));
      } else {
        const channelApeErrorResponse =
          GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
            this.EXPECTED_GET_OR_UPDATE_STATUS);
        reject(channelApeErrorResponse);
      }
    });
  }

  private formatLocation(location: any): Location {
    location.createdAt = new Date(location.createdAt);
    location.updatedAt = new Date(location.updatedAt);
    return location as Location;
  }
}
