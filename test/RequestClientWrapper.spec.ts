import * as sinon from 'sinon';
import { expect } from 'chai';
import * as request from 'request';
import Environment from '../src/model/Environment';
import RequestClientWrapper from '../src/RequestClientWrapper';

import singleOrder from './orders/resources/singleOrder';
import singleOrderToUpdate from './orders/resources/singleOrderToUpdate';
import multipleOrders from './orders/resources/multipleOrders';
import ChannelApeError from '../src/model/ChannelApeError';

describe('RequestClientWrapper', () => {

  describe('Given some rest client', () => {

    let sandbox: sinon.SinonSandbox;

    beforeEach((done) => {
      sandbox = sinon.sandbox.create();
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

    const requestClientWrapper: RequestClientWrapper = new RequestClientWrapper(client);

    it('When doing a get() with just a URI and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, singleOrder);

      requestClientWrapper.get(requestUrl, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.id).to.equal(orderId);
        done();
      });
    });

    it('When doing a get() with a URI, options, and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders`;
      const options: request.CoreOptions = {
        qs: {
          businessId,
          status: 'OPEN'
        }
      };
      const response = {
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, { orders: multipleOrders });

      requestClientWrapper.get(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.orders[0].businessId).to.equal(businessId);
        done();
      });
    });

    it('When doing a get() with just options and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
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
        statusCode: 200
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, { orders: multipleOrders });

      requestClientWrapper.get(options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.orders[0].businessId).to.equal(businessId);
        done();
      });
    });

    it('When doing a get() with just options then expect request.Request to be returned', () => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders`;
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        qs: {
          businessId,
          status: 'OPEN'
        }
      };
      const r = requestClientWrapper.get(options);
      expect(r).to.be.an('object');
    });

    it('When doing a put() with just a URI and call back expect ChannelApe error to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const requestUrl = `/v1/orders/${orderId}`;
      const response = {
        statusCode: 404
      };
      const channelApeError: ChannelApeError = {
        code: 0,
        message: 'You didnt pass any body'
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'put')
        .yields(null, response, { errors: [channelApeError] });

      requestClientWrapper.put(requestUrl, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.errors[0].code).to.equal(0);
        done();
      });
    });

    it('When doing a put() with a URI, options, and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders/${orderId}`;
      singleOrderToUpdate.additionalFields[0].value = 'RRR';
      const options: request.CoreOptions = {
        body: singleOrderToUpdate
      };
      const response = {
        statusCode: 202
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'put')
        .yields(null, response, singleOrderToUpdate);

      requestClientWrapper.put(requestUrl, options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
        done();
      });
    });

    it('When doing a put() with just options and call back expect data to be returned', (done) => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders/${orderId}`;
      singleOrderToUpdate.additionalFields[0].value = 'RRR';
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        body: singleOrderToUpdate
      };
      const response = {
        statusCode: 202
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'put')
        .yields(null, response, singleOrderToUpdate);

      requestClientWrapper.put(options, (error, response, body) => {
        expect(error).to.be.null;
        expect(body.additionalFields[0].value).to.equal('RRR');
        done();
      });
    });

    it('When doing a put() with just options expect request.Request to be returned', () => {
      const orderId = 'c0f45529-cbed-4e90-9a38-c208d409ef2a';
      const businessId = '4d688534-d82e-4111-940c-322ba9aec108';
      const requestUrl = `/v1/orders/${orderId}`;
      singleOrderToUpdate.additionalFields[0].value = 'RRR';
      const options: request.CoreOptions & request.UriOptions = {
        uri: requestUrl,
        body: singleOrderToUpdate
      };
      const r = requestClientWrapper.put(options);
      expect(r).to.be.an('object');
    });
  });
});
