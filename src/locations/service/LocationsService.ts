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
import LocationSLA from '../model/LocationSLA';
import LocationClosureResponse from '../model/LocationClosureResponse';
import LocationClosedDay from '../model/LocationClosedDay';
import LocationSLAOperatingDay from '../model/LocationSLAOperatingDay';
import LocationClosureRequest from '../model/LocationClosureRequest';

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
  public updateSla(locationId: string, sla: LocationSLA): Promise<LocationSLA> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.LOCATIONS}/${locationId}/sla`;
      const options = {
        data: sla
      };
      this.client.put(requestUrl, options, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapLocationSLAResponse(requestUrl, requestResponse, this.EXPECTED_GET_OR_UPDATE_STATUS));
      });
    });
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

  public getSla(locationId: string): Promise<LocationSLA> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.LOCATIONS}/${locationId}/sla`;
      this.client.get(requestUrl, {}, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapLocationSLAResponse(requestUrl, requestResponse, this.EXPECTED_GET_OR_UPDATE_STATUS));
      });
    });
  }
  public updateClosures(locationId: string, closedDates: LocationClosureRequest): Promise<LocationClosedDay []> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.LOCATIONS}/${locationId}/closures`;
      const options = {
        data: closedDates
      };
      this.client.put(requestUrl, options, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapLocationClosuresResponse(requestUrl, requestResponse, this.EXPECTED_GET_OR_UPDATE_STATUS));
      });
    });
  }
  public getClosures(locationId: string): Promise<LocationClosedDay[]> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.LOCATIONS}/${locationId}/closures`;
      this.client.get(requestUrl, {}, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapLocationClosuresResponse(requestUrl, requestResponse, this.EXPECTED_GET_OR_UPDATE_STATUS));
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
  private mapLocationSLAResponse(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<LocationSLA> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        const data: LocationSLA = requestCallbackParams.body as LocationSLA;
        resolve(this.formatLocationSLA(data));
      } else {
        const channelApeErrorResponse =
          GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
            this.EXPECTED_GET_OR_UPDATE_STATUS);
        reject(channelApeErrorResponse);
      }
    });
  }
  private mapLocationClosuresResponse(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<LocationClosedDay[]> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        const data: LocationClosureResponse = requestCallbackParams.body as LocationClosureResponse;
        resolve(data.closedDays.map(closedDay => this.formatLocationClosure(closedDay)));
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

  private formatLocationClosure(locationClosedDay: any): LocationClosedDay {
    locationClosedDay.createdAt = new Date(locationClosedDay.createdAt);
    locationClosedDay.updatedAt = new Date(locationClosedDay.updatedAt);
    return locationClosedDay as LocationClosedDay;
  }
  private formatLocationSLA(locationSla: LocationSLA): LocationSLA {
    locationSla.createdAt = new Date(locationSla.createdAt);
    locationSla.updatedAt = new Date(locationSla.updatedAt);
    locationSla.operatingDays = locationSla.operatingDays.map(operatingDay =>
      this.locationSLAOperatingDay(operatingDay));
    return locationSla as LocationSLA;
  }
  private locationSLAOperatingDay(locationSLAOperatingDay: LocationSLAOperatingDay): LocationSLAOperatingDay {
    locationSLAOperatingDay.createdAt = new Date(locationSLAOperatingDay.createdAt);
    locationSLAOperatingDay.updatedAt = new Date(locationSLAOperatingDay.updatedAt);
    return locationSLAOperatingDay as LocationSLAOperatingDay;
  }
}
