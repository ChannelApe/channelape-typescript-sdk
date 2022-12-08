import RequestClientWrapper from '../../RequestClientWrapper';
import Version from '../../model/Version';
import RestService from '../../service/RestService';
import LoggingRequest from '../model/LoggingRequest';
import LoggingResponse from '../model/LoggingResponse';
import { AxiosRequestConfig } from 'axios';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import GenerateApiError from '../../utils/GenerateApiError';

export default class LoggingService extends RestService {
  private readonly EXPECTED_CREATE_STATUS = 201;

  constructor(private readonly client: RequestClientWrapper) {
    super();
  }

  public logPayload(loggingRequest: LoggingRequest): Promise<LoggingResponse> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}/logs`;
      const options: AxiosRequestConfig = {
        data: loggingRequest.body,
      };
      if (loggingRequest.flow) {
        options.headers = {
          'X-Channel-Ape-Logs-Flow': loggingRequest.flow,
        };
      }
      this.client.post(requestUrl, options, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body,
        };
        resolve(
          this.mapLoggingResponse(
            requestUrl,
            requestResponse,
            this.EXPECTED_CREATE_STATUS
          )
        );
      });
    });
  }

  private mapLoggingResponse(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<LoggingResponse> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        resolve(requestCallbackParams.body as LoggingResponse);
      } else {
        const channelApeErrorResponse = GenerateApiError(
          requestUrl,
          requestCallbackParams.response,
          requestCallbackParams.body,
          this.EXPECTED_CREATE_STATUS
        );
        reject(channelApeErrorResponse);
      }
    });
  }
}
