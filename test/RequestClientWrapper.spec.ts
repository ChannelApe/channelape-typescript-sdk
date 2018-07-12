// tslint:disable:no-trailing-whitespace
import * as sinon from 'sinon';
import { expect } from 'chai';
import * as request from 'request';
import Environment from '../src/model/Environment';
import RequestClientWrapper from '../src/RequestClientWrapper';
import { Logger, LogLevel } from 'channelape-logger';

import singleOrder from './orders/resources/singleOrder';
import singleOrderToUpdate from './orders/resources/singleOrderToUpdate';
import multipleOrders from './orders/resources/multipleOrders';
import ChannelApeApiError from '../src/model/ChannelApeApiError';

const maximumRequestRetryTimeout = 3000;

describe('RequestClientWrapper', () => {

  describe('Given some rest client', () => {

    let sandbox: sinon.SinonSandbox;
    let requestClientWrapper: RequestClientWrapper;
    let infoLogSpy: sinon.SinonSpy;
    let warnLogSpy: sinon.SinonSpy;

    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
      infoLogSpy = sandbox.spy(Logger.prototype, 'info');
      warnLogSpy = sandbox.spy(Logger.prototype, 'warn');
      requestClientWrapper =
        new RequestClientWrapper(client, LogLevel.INFO, Environment.STAGING, maximumRequestRetryTimeout);
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    const client = request.defaults({
      baseUrl: Environment.STAGING,
      timeout: 60000,
      json: true,
      headers: {
        'X-Channel-Ape-Authorization-Token': 'valid-session-id'
      }
    });

    it('When doing a get() with just a URI and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const response = {
        statusCode: 200,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`
      };
      sandbox.stub(client, 'get')
        .yields(null, response, singleOrder);

      requestClientWrapper.get(requestUrl, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.id).to.equal(orderId);
        done();
      });
    });

    it('When doing a get() with a URI, options, and call back expect data to be returned', (done) => {
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders`;
      const options: request.CoreOptions = {
        qs: {
          businessId,
          status: 'OPEN'
        }
      };
      const response = {
        statusCode: 200,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`
      };
      sandbox.stub(client, 'get')
        .yields(null, response, { orders: multipleOrders });

      requestClientWrapper.get(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.orders[0].businessId).to.equal(businessId);
        done();
      });
    });

    it('When doing a get() with just options and call back expect data to be returned', (done) => {
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders`;
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        qs: {
          businessId,
          status: 'OPEN'
        }
      };
      const response = {
        statusCode: 200,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`
      };
      sandbox.stub(client, 'get')
        .yields(null, response, { orders: multipleOrders });

      requestClientWrapper.get(options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.orders[0].businessId).to.equal(businessId);
        done();
      });
    });

    it('When doing a get() with query params, expect the query params to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        qs: {
          param: true,
          anotherParam: false
        }
      };
      requestClientWrapper.get(options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0])
          .to.equal(`GET ${Environment.STAGING}${requestUrl}?param=true&anotherParam=false -- STARTED`);
        done();
      });
    });

    it('When doing a get() with a single query param, expect the query param to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        qs: {
          param: true
        }
      };
      requestClientWrapper.get(options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`GET ${Environment.STAGING}${requestUrl}?param=true -- STARTED`);
        done();
      });
    });

    it('When doing a get() with no query params, expect no query params to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        qs: { }
      };
      requestClientWrapper.get(options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`GET ${Environment.STAGING}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When doing a get() with no options, expect just the url to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      requestClientWrapper.get(requestUrl, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`GET ${Environment.STAGING}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When doing a put() with just a URI and call back expect ChannelApe error to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const response = {
        statusCode: 404,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`
      };
      const channelApeApiError: ChannelApeApiError = {
        code: 0,
        message: 'You didnt pass any body'
      };
      // tslint:disable:no-trailing-whitespace
      const expectedErrorMessage =
`PUT /v1/orders/c0f45529-cbed-4e90-9a38-c208d409ef2a
  Status: 404 
  Response Body:
  404 undefined
Code: 0 Message: You didnt pass any body`;
      // tslint:enable:no-trailing-whitespace
      sandbox.stub(client, 'put')
        .yields(null, response, { errors: [channelApeApiError] });

      requestClientWrapper.put(requestUrl, (error, response, body) => {
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
      const options: request.CoreOptions = {
        body: singleOrderToUpdate
      };
      const response = {
        statusCode: 202,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`
      };
      sandbox.stub(client, 'put')
        .yields(null, response, singleOrderToUpdate);

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
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        body: singleOrderToUpdate
      };
      const response = {
        statusCode: 202,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`
      };
      sandbox.stub(client, 'put')
        .yields(null, response, singleOrderToUpdate);

      requestClientWrapper.put(options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
        done();
      });
    });

    it('When doing a put() expect the call to be logged', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        body: singleOrderToUpdate
      };
      requestClientWrapper.put(options, () => {
        expect(infoLogSpy.called).to.be.true;
        expect(infoLogSpy.args[0][0]).to.equal(`PUT ${Environment.STAGING}${requestUrl} -- STARTED`);
        done();
      });
    });

    it('When handling a GET response expect the call to be retried on 500 level status codes and 429s', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest = {
        method: 'GET',
        href: `${Environment.STAGING}${requestUrl}`
      };
      const responses = [{
        statusCode: 500,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 502,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 599,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 429,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 200,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }];
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get');
      clientGetStub.onCall(0).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[0], 'Im'), 50);
        } else {
          setTimeout(() => cb(null, responses[0], 'Im'), 50);
        }
      });
      clientGetStub.onCall(1).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[1], 'a'), 50);
        } else {
          setTimeout(() => cb(null, responses[1], 'a'), 50);
        }
      });
      clientGetStub.onCall(2).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[2], 'little'), 50);
        } else {
          setTimeout(() => cb(null, responses[2], 'little'), 50);
        }
      });
      clientGetStub.onCall(3).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[3], 'teapot'), 50);
        } else {
          setTimeout(() => cb(null, responses[3], 'teapot'), 50);
        }
      });
      clientGetStub.onCall(4).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[4], singleOrder), 50);
        } else {
          setTimeout(() => cb(null, responses[4], singleOrder), 50);
        }
      });

      requestClientWrapper.get(requestUrl, (error, response, body) => {
        expect(warnLogSpy.called).to.be.true;
        expect(warnLogSpy.args[0][0])
          .to.include(`DELAYING GET ${Environment.STAGING}${requestUrl} for 100ms`, 'should log 1st delay correctly');
        expect(warnLogSpy.args[1][0])
          .to.include(`DELAYING GET ${Environment.STAGING}${requestUrl} for 200ms`, 'should log 2nd delay correctly');
        expect(warnLogSpy.args[2][0])
          .to.include(`DELAYING GET ${Environment.STAGING}${requestUrl} for 400ms`, 'should log 3rd delay correctly');
        expect(error).to.be.null;
        expect(body.id).to.equal(orderId);
        expect(infoLogSpy.args[0][0])
          .to.equal(`GET ${Environment.STAGING}${requestUrl} -- STARTED`, 'should log correctly');
        done();
      });
    }).timeout(100000);

    it('When handling a PUT response expect the call to be retried on 500 level status codes and 429s', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest = {
        method: 'PUT',
        href: `${Environment.STAGING}${requestUrl}`
      };
      const responses = [{
        statusCode: 500,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 502,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 599,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 429,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 202,
        method: 'PUT',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }];
      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put');
      clientPutStub.onCall(0).yields(null, responses[0], 'Im');
      clientPutStub.onCall(1).yields(null, responses[1], 'a');
      clientPutStub.onCall(2).yields(null, responses[2], 'little');
      clientPutStub.onCall(3).yields(null, responses[3], 'teapot');
      clientPutStub.onCall(4).yields(null, responses[4], singleOrder);

      requestClientWrapper.put(requestUrl, { body: singleOrder }, (error, response, body) => {
        expect(error).to.be.null;
        expect(warnLogSpy.called).to.be.true;
        expect(warnLogSpy.args[0][0])
          .to.include(`DELAYING PUT ${Environment.STAGING}${requestUrl} for 100ms`, 'should log 1st delay correctly');
        expect(warnLogSpy.args[1][0])
          .to.include(`DELAYING PUT ${Environment.STAGING}${requestUrl} for 200ms`, 'should log 2nd delay correctly');
        expect(warnLogSpy.args[2][0])
          .to.include(`DELAYING PUT ${Environment.STAGING}${requestUrl} for 400ms`, 'should log 3rd delay correctly');
        expect(body.id).to.equal(orderId);
        expect(infoLogSpy.args[0][0])
          .to.equal(`PUT ${Environment.STAGING}${requestUrl} -- STARTED`, 'should log correctly');
        done();
      });
    });

    it(`When handling a GET response expect the call to be retried
      until the MaximumRequestRetryTimeout limit is exceeded`, (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest = {
        method: 'GET',
        href: `${Environment.STAGING}${requestUrl}`
      };
      const responses = [{
        statusCode: 500,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 502,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 599,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 429,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 200,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }];
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get');
      clientGetStub.onCall(0).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[0], 'Im'), 1);
        } else {
          setTimeout(() => cb(null, responses[0], 'Im'), 1);
        }
      });
      clientGetStub.onCall(1).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[1], 'a'), 1);
        } else {
          setTimeout(() => cb(null, responses[1], 'a'), 1);
        }
      });
      clientGetStub.onCall(2).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[2], 'little'), 1);
        } else {
          setTimeout(() => cb(null, responses[2], 'little'), 1);
        }
      });
      clientGetStub.onCall(3).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[3], 'teapot'), 1);
        } else {
          setTimeout(() => cb(null, responses[3], 'teapot'), 1);
        }
      });
      clientGetStub.onCall(4).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[4], singleOrder), 4000);
        } else {
          setTimeout(() => cb(null, responses[4], singleOrder), 4000);
        }
      });

      requestClientWrapper.get(requestUrl, (error, response, body) => {
        const expectedErrorMessage = 'Your request was tried a total of';
        expect(error).not.to.be.null;
        expect(error.message).to.include(expectedErrorMessage);
        done();
      });
    }).timeout(10000);

    it(`When handling a GET response expect the call to be retried
      until only until a non 500 / 429 response is received`, (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const fakeRequest = {
        method: 'GET',
        href: `${Environment.STAGING}${requestUrl}`
      };
      const responses = [{
        statusCode: 500,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 502,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 599,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 429,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }, {
        statusCode: 200,
        method: 'GET',
        url: `${Environment.STAGING}${requestUrl}`,
        request: fakeRequest
      }];
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get');
      clientGetStub.onCall(0).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[0], 'Im'), 10);
        } else {
          setTimeout(() => cb(null, responses[0], 'Im'), 10);
        }
      });
      clientGetStub.onCall(1).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[1], 'a'), 10);
        } else {
          setTimeout(() => cb(null, responses[1], 'a'), 10);
        }
      });
      clientGetStub.onCall(2).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[2], 'little'), 10);
        } else {
          setTimeout(() => cb(null, responses[2], 'little'), 10);
        }
      });
      clientGetStub.onCall(3).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[3], 'teapot'), 10);
        } else {
          setTimeout(() => cb(null, responses[3], 'teapot'), 10);
        }
      });
      clientGetStub.onCall(4).callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, responses[4], singleOrder), 10);
        } else {
          setTimeout(() => cb(null, responses[4], singleOrder), 10);
        }
      });

      requestClientWrapper.get(requestUrl, {}, (error, response, body) => {
        expect(error).to.be.null;
        done();
      });
    }).timeout(10000);

    it(`When handling a GET response expect callback with an empty response to be handled gracefully`, (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get');
      clientGetStub.callsFake((uriOrOptions: any, cbOrOpts: any, cb: any) => {
        if (typeof cbOrOpts === 'function') {
          setTimeout(() => cbOrOpts(null, undefined, undefined), 1000);
        } else {
          setTimeout(() => cb(null, undefined, undefined), 1000);
        }
      });

      requestClientWrapper.get(requestUrl, (error, response, body) => {
        const expectedErrorMessage = 'No response was received from the server';
        expect(error).not.to.be.null;
        expect(error.message).to.include(expectedErrorMessage);
        done();
      });
    }).timeout(100000);
  });
});
