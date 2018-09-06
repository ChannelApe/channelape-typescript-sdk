// tslint:disable:no-trailing-whitespace
import * as sinon from 'sinon';
import { expect } from 'chai';
import axios, { AxiosRequestConfig } from 'axios';
import { Logger } from 'channelape-logger';
import * as Q from 'q';

import RequestClientWrapper from '../src/RequestClientWrapper';
import singleOrder from './orders/resources/singleOrder';
import singleOrderToUpdate from './orders/resources/singleOrderToUpdate';
import multipleOrders from './orders/resources/multipleOrders';
import ChannelApeApiError from '../src/model/ChannelApeApiError';
import { ChannelApeError, LogLevel } from '../src';

const maximumRequestRetryTimeout = 600;
const endpoint = 'https://fake-api.test.com';
const JITTER_DELAY_MIN = 50;
const JITTER_DELAY_MAX = 200;

describe('RequestClientWrapper', () => {

  describe('Given some rest client', () => {

    let sandbox: sinon.SinonSandbox;
    let requestClientWrapper: RequestClientWrapper;
    let infoLogSpy: sinon.SinonSpy;
    let warnLogSpy: sinon.SinonSpy;

    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      infoLogSpy = sandbox.spy(Logger.prototype, 'info');
      warnLogSpy = sandbox.spy(Logger.prototype, 'warn');
      requestClientWrapper = new RequestClientWrapper(
        60000,
        'valid-session-id',
        LogLevel.INFO,
        endpoint,
        maximumRequestRetryTimeout,
        JITTER_DELAY_MIN,
        JITTER_DELAY_MAX
      );
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('When doing a get() with just a URI and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const response = {
        status: 200,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        data: singleOrder
      };

      sandbox.stub(axios, 'get').resolves(response);

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.id).to.equal(orderId);
        done();
      });
    });

    it('When doing a get() with a URI, options, and call back expect data to be returned', (done) => {
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders`;
      const options: AxiosRequestConfig = {
        params: {
          businessId,
          status: 'OPEN'
        }
      };
      const response = {
        status: 200,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        data: { orders: multipleOrders }
      };
      sandbox.stub(axios, 'get').resolves(response);

      requestClientWrapper.get(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.orders[0].businessId).to.equal(businessId);
        done();
      });
    });

    it('When doing a get() with just options and call back expect data to be returned', (done) => {
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders`;
      const options: AxiosRequestConfig = {
        url: requestUrl,
        params: {
          businessId,
          status: 'OPEN'
        }
      };
      const response = {
        status: 200,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        data: { orders: multipleOrders }
      };
      sandbox.stub(axios, 'get').resolves(response);

      requestClientWrapper.get(options.url!, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.orders[0].businessId).to.equal(businessId);
        done();
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
        params: { }
      };
      requestClientWrapper.get(options.url!, options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`GET ${endpoint}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When doing a get() with no options, expect just the url to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
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
      const response = {
        status: 404,
        method: 'PUT',
        url: `${endpoint}${requestUrl}`,
        data: { errors: [channelApeApiError] },
        config: { method: 'PUT' }
      };
      // tslint:disable:no-trailing-whitespace
      const expectedErrorMessage =
`PUT /v1/orders/c0f45529-cbed-4e90-9a38-c208d409ef2a
  Status: 404
  Response Body:
  404 undefined
Code: 0 Message: You didnt pass any body`;
      // tslint:enable:no-trailing-whitespace
      sandbox.stub(axios, 'put').resolves(response);

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
      const response = {
        status: 202,
        method: 'PUT',
        url: `${endpoint}${requestUrl}`,
        config: options,
        data: singleOrderToUpdate
      };
      sandbox.stub(axios, 'put').resolves(response);

      requestClientWrapper.put(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
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
      const response = {
        status: 202,
        method: 'PUT',
        url: `${endpoint}${requestUrl}`,
        data: singleOrderToUpdate
      };
      sandbox.stub(axios, 'put').resolves(response);

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
      requestClientWrapper.put(options.url!, options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`PUT ${endpoint}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When handling a GET response expect the call to be retried on 500 level status codes and 429s', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest = {
        method: 'GET',
        url: `${endpoint}${requestUrl}`
      };
      const responses = [{
        status: 500,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest
      }, {
        status: 599,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest
      }, {
        status: 429,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest
      }, {
        status: 200,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: { id: orderId }
      }];
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
      clientGetStub.onCall(0).resolves(responses[0]);
      clientGetStub.onCall(1).resolves(responses[1]);
      clientGetStub.onCall(2).resolves(responses[2]);
      clientGetStub.onCall(3).resolves(responses[3]);

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
    });

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
      const clientPutStub: sinon.SinonStub = sandbox.stub(axios, 'put');
      clientPutStub.onCall(0).resolves(responses[0]);
      clientPutStub.onCall(1).resolves(responses[1]);
      clientPutStub.onCall(2).resolves(responses[2]);
      clientPutStub.onCall(3).resolves(responses[3]);

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
    });

    it(`When handling a GET response expect the call to be retried
      until the MaximumRequestRetryTimeout limit is exceeded`, (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest: AxiosRequestConfig = {
        method: 'GET',
        data: { order: { id: orderId } }
      };
      const responses = [{
        status: 500,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'Im'
      }, {
        status: 502,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'a'
      }, {
        status: 599,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'little'
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
        data: fakeRequest.data
      }];
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
      clientGetStub.onCall(0).resolves(responses[0]);
      clientGetStub.onCall(1).resolves(responses[1]);
      clientGetStub.onCall(2).callsFake(() => {
        const deferred = Q.defer();
        setTimeout(() => deferred.resolve(responses[2]), 600);
        return deferred.promise;
      });
      clientGetStub.onCall(3).resolves(responses[3]);
      clientGetStub.onCall(4).resolves(responses[4]);

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        const expectedErrorMessage = 'Your request was tried a total of';
        expect(error).not.to.be.null;
        expect(error.message).to.include(expectedErrorMessage);
        done();
      });
    });

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
        status: 502,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'a'
      }, {
        status: 599,
        method: 'GET',
        url: `${endpoint}${requestUrl}`,
        config: fakeRequest,
        data: 'little'
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
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
      clientGetStub.onCall(0).resolves(responses[0]);
      clientGetStub.onCall(1).resolves(responses[1]);
      clientGetStub.onCall(2).resolves(responses[2]);
      clientGetStub.onCall(3).resolves(responses[3]);
      clientGetStub.onCall(4).resolves(responses[4]);

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        expect(error).to.be.null;
        done();
      });
    });

    it(`When handling a GET response expect callback with an empty response to be handled gracefully`, (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const clientGetStub: sinon.SinonStub = sandbox.stub(axios, 'get');
      clientGetStub.callsFake((url: string, options: AxiosRequestConfig) => {
        const deferred = Q.defer();
        setTimeout(() => deferred.resolve(null as any), 100);
        return deferred.promise;
      });

      requestClientWrapper.get(requestUrl, {}, (error: ChannelApeError, response, body) => {
        const expectedErrorMessage = 'No response was received from the server';
        expect(error).not.to.be.null;
        expect(error.message).to.include(expectedErrorMessage);
        expect(error.ApiErrors.length).to.equal(1);
        expect(error.ApiErrors[0].code).to.equal(504);
        expect(error.ApiErrors[0].message).to.equal('No response was received from the server');
        done();
      });
    });

    it(`When handling an axios error ensure proper error handling`, (done) => {
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
  });
});
