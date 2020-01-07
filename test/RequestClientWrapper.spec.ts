// tslint:disable:no-trailing-whitespace
import * as sinon from 'sinon';
import { expect } from 'chai';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { Logger } from 'channelape-logger';

import RequestClientWrapper from '../src/RequestClientWrapper';
import singleOrder from './orders/resources/singleOrder';
import singleOrderToUpdate from './orders/resources/singleOrderToUpdate';
import multipleOrders from './orders/resources/multipleOrders';
import ChannelApeApiError from '../src/model/ChannelApeApiError';
import { ChannelApeError, LogLevel } from '../src';
import { RequestConfig } from '../src/model/RequestConfig';
import HttpRequestMethod from '../src/model/HttpRequestMethod';
import { fail } from 'assert';

const maximumRequestRetryTimeout = 600;

const JITTER_DELAY_MIN = 50;
const JITTER_DELAY_MAX = 200;

describe('RequestClientWrapper', () => {
  describe('Given some rest client', () => {
    let mockedAxios = new axiosMockAdapter(axios);

    let sandbox: sinon.SinonSandbox;
    let requestClientWrapper: RequestClientWrapper;
    let infoLogSpy: sinon.SinonSpy;
    let warnLogSpy: sinon.SinonSpy;
    const endpoint = 'https://fake-api.test.com';

    beforeEach((done) => {
      mockedAxios = new axiosMockAdapter(axios);
      sandbox = sinon.createSandbox();
      infoLogSpy = sandbox.spy(Logger.prototype, 'info');
      warnLogSpy = sandbox.spy(Logger.prototype, 'warn');
      requestClientWrapper = new RequestClientWrapper({
        endpoint,
        maximumRequestRetryTimeout,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: JITTER_DELAY_MIN,
        maximumRequestRetryRandomDelay: JITTER_DELAY_MAX,
        maximumConcurrentConnections: 5
      });
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('When doing a get() with just a URI and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      mockedAxios.onGet(`${endpoint}${requestUrl}`).reply((config) => {
        expect(config.headers!['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
        expect(config.headers!['Content-Type']).to.equal('application/json');
        return [
          200,
          singleOrder
        ];
      });
      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.id).to.equal(orderId);
        done();
      });
    });

    it('When doing a get() with a URI, options, and call back expect data to be returned', (done) => {
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = '/v1/orders';
      const options: AxiosRequestConfig = {
        params: {
          businessId,
          status: 'OPEN'
        }
      };
      mockedAxios.onGet(`${endpoint}${requestUrl}`).reply(200, { orders: multipleOrders });
      requestClientWrapper.get(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.orders[0].businessId).to.equal(businessId);
        done();
      });
    });

    describe('When doing a get() with just options and call back', () => {
      describe('given no network timeout', () => {
        it('expect data to be returned', (done) => {
          const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
          const requestUrl = '/v1/orders';
          const options: AxiosRequestConfig = {
            url: requestUrl,
            params: {
              businessId,
              status: 'OPEN'
            }
          };
          mockedAxios.onAny().reply(200, { orders: multipleOrders });
          requestClientWrapper.get(options.url!, options, (error, response, body) => {
            expect(error).to.be.null;
            expect(body.orders[0].businessId).to.equal(businessId);
            done();
          });
        });
      });

      describe('given ChannelApe API times out', () => {
        it('expect the calls to be retried until config.timeout is exceeded', (done) => {
          const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
          const requestUrl = '/v1/orders';
          const options: AxiosRequestConfig = {
            url: requestUrl,
            params: {
              businessId,
              status: 'OPEN'
            }
          };
          mockedAxios.onAny().timeout();
          requestClientWrapper.get(options.url!, options, (error, response, body) => {
            expect(error).not.to.be.null;
            expect(error.message).includes('A problem with the ChannelApe API has been encountered.');
            expect(error.message).includes('Your request was tried a total of ');
            done();
          });
        });
      });

      describe('given a low level network error', () => {
        it('expect the calls to be retried until config.timeout is exceeded', (done) => {
          const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
          const requestUrl = '/v1/orders';
          const options: AxiosRequestConfig = {
            url: requestUrl,
            params: {
              businessId,
              status: 'OPEN'
            }
          };
          mockedAxios.onAny().networkError();
          requestClientWrapper.get(options.url!, options, (error, response, body) => {
            expect(error).not.to.be.null;
            expect(error.message).includes('A problem with the ChannelApe API has been encountered.');
            expect(error.message).includes('Your request was tried a total of ');
            expect(warnLogSpy.args[0][0]).to.equal(`get ${endpoint}/v1/orders -- FAILED WITH STATUS: Network Error`);
            done();
          });
        }).timeout(3000);
      });

      describe('given a low level network error: ECONNREFUSED', () => {
        it('expect the calls to be retried until config.timeout is exceeded', (done) => {

          const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
          const requestUrl = '/v1/orders';
          const options: AxiosRequestConfig = {
            url: requestUrl,
            params: {
              businessId,
              status: 'OPEN'
            }
          };

          const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
          clientGetStub.rejects({
            code: 'ECONNREFUSED',
            message: 'ECONNREFUSED',
            config: {
              method: 'get',
              url: requestUrl
            }
          });

          requestClientWrapper.get(requestUrl!, options, (error, response, body) => {
            expect(error).not.to.be.null;
            expect(error.message).includes('A problem with the ChannelApe API has been encountered.');
            expect(error.message).includes('Your request was tried a total of ');
            expect(warnLogSpy.args[0][0]).to.equal('get /v1/orders -- FAILED WITH STATUS: ECONNREFUSED');
            done();
          });
        }).timeout(2000);
      });
    });

    it('When doing a get() with query params, expect the query params to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: AxiosRequestConfig = {
        url: requestUrl,
        params: {
          param: true,
          anotherParam: false
        }
      };
      mockedAxios.onGet().reply(200);
      requestClientWrapper.get(options.url!, options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0])
          .to.equal(`GET ${endpoint}${requestUrl}?param=true&anotherParam=false -- STARTED`);
        done();
      });
    });

    it('When doing a get() with a single query param, expect the query param to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: AxiosRequestConfig = {
        url: requestUrl,
        params: {
          param: true
        }
      };
      mockedAxios.onGet().reply(200);
      requestClientWrapper.get(options.url!, options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`GET ${endpoint}${requestUrl}?param=true -- STARTED`);
        done();
      });
    });

    it('When doing a get() with no query params, expect no query params to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: AxiosRequestConfig = {
        url: requestUrl,
        params: {}
      };
      mockedAxios.onGet().reply(200);
      requestClientWrapper.get(options.url!, options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`GET ${endpoint}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When doing a get() with no options, expect just the url to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      mockedAxios.onGet().reply(200);
      requestClientWrapper.get(requestUrl, {}, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`GET ${endpoint}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When doing a put() with just a URI and call back expect ChannelApe error to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const channelApeApiError: ChannelApeApiError = {
        code: 0,
        message: 'You didnt pass any body'
      };
      // tslint:disable:no-trailing-whitespace
      const expectedErrorMessage =
        `put /v1/orders/c0f45529-cbed-4e90-9a38-c208d409ef2a
  Status: 404
  Response Body:
  Request failed with status code 404
Code: 0 Message: You didnt pass any body`;
      // tslint:enable:no-trailing-whitespace
      mockedAxios.onPut(`${endpoint}${requestUrl}`).reply(404, { errors: [channelApeApiError] });

      requestClientWrapper.put(requestUrl, {}, (error, response, body) => {
        expect(error).not.to.be.null;
        expect(error.message).to.equal(expectedErrorMessage);
        done();
      });
    });

    it('When doing a put() with a URI, options, and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      if (typeof singleOrderToUpdate.additionalFields === 'undefined') {
        throw new Error('additionalFields should be defined');
      }
      singleOrderToUpdate.additionalFields[0].value = 'RRR';
      const options: AxiosRequestConfig = {
        data: singleOrderToUpdate,
        method: 'PUT'
      };
      mockedAxios.onPut(`${endpoint}${requestUrl}`).reply((config) => {
        expect(JSON.parse(config.data).body.additionalFields[0].value).to.equal('RRR');
        return [201, singleOrderToUpdate];
      });
      requestClientWrapper.put(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
        done();
      });
    });

    it('When doing a a bodiless put() with a URI, options, and call back expect data to be returned', (done) => {
      const actionId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/actions/${actionId}/healthcheck`;
      const options: AxiosRequestConfig = {
        method: 'PUT'
      };
      mockedAxios.onPut(`${endpoint}${requestUrl}`).reply((config) => {
        expect(JSON.parse(config.data).body).to.equal('');
        return [
          201,
          ''
        ];
      });
      requestClientWrapper.put(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        done();
      });
    });

    it('When doing a put() with just options and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      if (typeof singleOrderToUpdate.additionalFields === 'undefined') {
        throw new Error('additionalFields should be defined');
      }
      singleOrderToUpdate.additionalFields[0].value = 'RRR';
      const options: AxiosRequestConfig = {
        url: requestUrl,
        data: singleOrderToUpdate
      };
      mockedAxios.onPut(`${endpoint}${requestUrl}`).reply(200, singleOrderToUpdate);

      requestClientWrapper.put(options.url!, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
        done();
      });
    });

    it('When doing a put() expect the call to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: AxiosRequestConfig = {
        url: requestUrl,
        data: singleOrderToUpdate
      };
      mockedAxios.onPut(`${endpoint}${requestUrl}`).reply(201, singleOrderToUpdate);
      requestClientWrapper.put(options.url!, options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`PUT ${endpoint}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When doing a post() with a URI, options, and call back expect data to be returned', (done) => {
      const requestUrl = '/v1/orders/';
      if (typeof singleOrderToUpdate.additionalFields === 'undefined') {
        throw new Error('additionalFields should be defined');
      }
      singleOrderToUpdate.additionalFields[0].value = 'RRR';
      const options: AxiosRequestConfig = {
        data: singleOrderToUpdate,
        method: 'POST'
      };
      mockedAxios.onPost(`${endpoint}${requestUrl}`).reply((config) => {
        expect(JSON.parse(config.data).body.additionalFields[0].value).to.equal('RRR');
        return [202, singleOrderToUpdate];
      });
      requestClientWrapper.post(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
        done();
      });
    });

    it('When doing a post() with just options and call back expect data to be returned', (done) => {
      const requestUrl = '/v1/orders/';
      if (typeof singleOrderToUpdate.additionalFields === 'undefined') {
        throw new Error('additionalFields should be defined');
      }
      singleOrderToUpdate.additionalFields[0].value = 'RRR';
      const options: AxiosRequestConfig = {
        url: requestUrl,
        data: singleOrderToUpdate
      };
      mockedAxios.onPost(`${endpoint}${requestUrl}`).reply(200, singleOrderToUpdate);

      requestClientWrapper.post(options.url!, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
        done();
      });
    });

    it('When doing a post() expect the call to be logged', (done) => {
      const requestUrl = '/v1/orders/';
      const options: AxiosRequestConfig = {
        url: requestUrl,
        data: singleOrderToUpdate
      };
      mockedAxios.onPost(`${endpoint}${requestUrl}`).reply(201, singleOrderToUpdate);
      requestClientWrapper.post(options.url!, options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`POST ${endpoint}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When handling a GET response expect the call to be retried on 500 level status codes and 429s', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const responses = [
        { method: 'GET', url: requestUrl, status: 500 },
        { method: 'GET', url: requestUrl, status: 599 },
        { method: 'GET', url: requestUrl, status: 429 },
        { method: 'GET', url: requestUrl, status: 200, data: { id: orderId } }
      ];
      mockedAxios.onAny().reply(() => {
        const response = responses.shift();
        if (response && response.data) {
          return [response.status, response.data];
        }
        return [500, { error: 'stupid' }];
      });

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        expect(warnLogSpy.called).to.be.true;
        expect(warnLogSpy.args[1][0])
            .to.include(`DELAYING GET ${endpoint}${requestUrl} for `, 'should log 1st delay correctly');
        expect(warnLogSpy.args[3][0])
            .to.include(`DELAYING GET ${endpoint}${requestUrl} for `, 'should log 2nd delay correctly');
        expect(warnLogSpy.args[5][0])
            .to.include(`DELAYING GET ${endpoint}${requestUrl} for `, 'should log 3rd delay correctly');
        expect(error).to.be.null;
        expect(body.id).to.equal(orderId);
        expect(infoLogSpy.args[0][0])
            .to.equal(`GET ${endpoint}${requestUrl} -- STARTED`, 'should log correctly');
        done();

      });
    }).timeout(5000);

    it('When handling a PUT response expect the call to be retried on 500 level status codes and 429s', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest: AxiosRequestConfig = {
        data: singleOrderToUpdate
      };
      const responses = [{
        status: 500,
        method: 'PUT',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'Im'
      }, {
        status: 599,
        method: 'PUT',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'little'
      }, {
        status: 429,
        method: 'PUT',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'teapot'
      }, {
        status: 202,
        method: 'PUT',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: { id: orderId }
      }];
      mockedAxios.onAny().reply(() => {
        const response = responses.shift();
        if (response && response.data) {
          return [response.status, response.data];
        }
        return [500, {}];
      });

      requestClientWrapper.put(requestUrl, fakeRequest, (error, response, body) => {

        expect(error).to.be.null;
        expect(warnLogSpy.called).to.be.true;
        const delayMs1 = parseInt(warnLogSpy.args[1][0].match(/\s(\d*)ms/g)[0].trim().replace('ms', ''), 10);
        expect(delayMs1).to.be.lessThan(JITTER_DELAY_MAX + 1);
        expect(delayMs1).to.be.greaterThan(JITTER_DELAY_MIN - 1);
        expect(warnLogSpy.args[1][0])
          .to.include(`DELAYING PUT ${endpoint}${requestUrl} for `, 'should log 1st delay correctly');
        const delayMs2 = parseInt(warnLogSpy.args[3][0].match(/\s(\d*)ms/g)[0].trim().replace('ms', ''), 10);
        expect(delayMs2).to.be.lessThan(JITTER_DELAY_MAX + 1);
        expect(delayMs2).to.be.greaterThan(JITTER_DELAY_MIN - 1);
        expect(warnLogSpy.args[3][0])
          .to.include(`DELAYING PUT ${endpoint}${requestUrl} for `, 'should log 2nd delay correctly');
        const delayMs3 = parseInt(warnLogSpy.args[5][0].match(/\s(\d*)ms/g)[0].trim().replace('ms', ''), 10);
        expect(delayMs3).to.be.lessThan(JITTER_DELAY_MAX + 1);
        expect(delayMs3).to.be.greaterThan(JITTER_DELAY_MIN - 1);
        expect(warnLogSpy.args[5][0])
          .to.include(`DELAYING PUT ${endpoint}${requestUrl} for `, 'should log 3rd delay correctly');
        expect(body.id).to.equal(orderId);
        expect(infoLogSpy.args[0][0])
          .to.equal(`PUT ${endpoint}${requestUrl} -- STARTED`, 'should log correctly');
        done();

      });
    }).timeout(2000);

    it(`When handling a GET response expect the call to be retried
      until the MaximumRequestRetryTimeout limit is exceeded`, (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      mockedAxios.onAny().reply(500, { response: {} });

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        const expectedErrorMessage = 'Your request was tried a total of';
        expect(error).not.to.be.null;
        expect(error.message).to.include(expectedErrorMessage);
        done();
      });
    }).timeout(5000);

    it(`When handling a GET response expect the call to be retried
      until a non 500 / 429 response is received`, (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest = {
        method: 'GET',
        href: `${endpoint}${requestUrl}`
      };
      const responses = [{
        status: 500,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'Im'
      }, {
        status: 429,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'teapot'
      }, {
        status: 200,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: singleOrder
      }];
      mockedAxios.onGet().reply(() => {
        const response = responses.shift();
        return [response!.status, response!.data];
      });

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        expect(error).to.be.null;
        done();
      });
    }).timeout(5000);

    it('When handling a GET response expect callback with an empty response to be handled gracefully', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      mockedAxios.onGet().reply(() => Promise.resolve([200, null as any]));

      requestClientWrapper.get(requestUrl, {}, (error: ChannelApeError, response, body) => {
        const expectedErrorMessage = 'API Error';
        expect(error).not.to.be.null;
        expect(error.message).to.equal(expectedErrorMessage);
        done();
      });
    });

    it('When handling an axios error ensure proper error handling', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
      clientGetStub.rejects({
        message: 'Generic Error',
        response: {}
      });

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        const expectedErrorMessage = 'Generic Error';
        expect(error).not.to.be.null;
        expect(error.message).to.include(expectedErrorMessage);
        expect(error.ApiErrors.length).to.equal(0);
        done();
      });
    });

    describe('Which has a maxConcurrentConnections config of 1', () => {

      it('When making a request when queue is full, then dont make request yet',  (done) => {

        requestClientWrapper = buildRequestClientWrapper(1);
        const requestClientWrapperPrepareRequestSpy = sandbox.spy(requestClientWrapper, 'prepareRequest');
        createQueuedRequests(10, requestClientWrapper);
        requestClientWrapper.get('/v1/orders/9999', {}, (error, response, body) => {
          fail('Call should have not been made.');
        });

        expect(requestClientWrapperPrepareRequestSpy.callCount).to.equal(0);
        done();
      });

      it('When making a request when queue is not full, then make request and pop the rest off queue',  (done) => {

        requestClientWrapper = buildRequestClientWrapper(11);
        const requestClientWrapperPrepareRequestSpy = sandbox.spy(requestClientWrapper, 'prepareRequest');
        createQueuedRequestsAsync(10, requestClientWrapper, done);
        mockedAxios.onGet('/v1/orders/9999').reply(200, { request: 9999 });
        requestClientWrapper.get('/v1/orders/9999', {}, (error, response, body) => {

        });
        expect(requestClientWrapperPrepareRequestSpy.callCount).to.equal(1);
      });
    });

    function createQueuedRequests(count: number, requestClientWrapper: RequestClientWrapper) {
      for (let requestNumber = 1; requestNumber <= count; requestNumber = requestNumber + 1) {
        mockedAxios.onGet(`/v1/orders/${requestNumber}`).reply(200, { request: requestNumber });
        const requestConfig: RequestConfig = {
          url: `/v1/orders/${requestNumber}`,
          params: {},
          callback: (error: any, response: any, body: any) => {
            expect(body).to.deep.equals('{ request: 1 }');
          },
          method: HttpRequestMethod.GET
        };
        requestClientWrapper.requestQueue.push(requestConfig);
        requestClientWrapper.pendingRequests += 1;
      }
    }

    function createQueuedRequestsAsync(count: number, requestClientWrapper: RequestClientWrapper, done: any) {
      for (let requestNumber = 1; requestNumber <= count; requestNumber = requestNumber + 1) {
        mockedAxios.onGet(`/v1/orders/${requestNumber}`).reply(200, `{ abc: ${requestNumber} }`);
        const requestConfig: RequestConfig = {
          url: `/v1/orders/${requestNumber}`,
          params: {},
          callback: (error: any, response: AxiosResponse, body: any) => {
            expect(response.status).to.equal(200);
            expect(body).to.deep.equal(`{ abc: ${requestNumber} }`);
            if (requestNumber === 1) {
              done();
            }
          },
          method: HttpRequestMethod.GET
        };
        requestClientWrapper.requestQueue.push(requestConfig);
        requestClientWrapper.pendingRequests += 1;
      }
    }

    function buildRequestClientWrapper(maximumConcurrentConnections: number) {
      return new RequestClientWrapper({
        maximumConcurrentConnections,
        endpoint,
        maximumRequestRetryTimeout,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: JITTER_DELAY_MIN,
        maximumRequestRetryRandomDelay: JITTER_DELAY_MAX
      });
    }
  });
}).timeout(3000);
