import * as sinon from 'sinon';
import { expect } from 'chai';
import * as Logger from 'channelape-logger';

import RequestLogger from '../../src/utils/RequestLogger';
import Environment from '../../src/model/Environment';
import { AxiosRequestConfig } from 'axios';

describe('RequestLogger', () => {

  let requestLogger: RequestLogger;
  let sandbox: sinon.SinonSandbox;
  let loggerStub: sinon.SinonStub;
  let fakeLogger: any;

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    fakeLogger = {
      info: sinon.spy(),
      warn: sinon.spy(),
      error: sinon.spy(),
      debug: sinon.spy()
    };
    loggerStub = sandbox.stub(Logger, 'Logger').returns(fakeLogger);
    requestLogger = new RequestLogger(Logger.LogLevel.VERBOSE, Environment.STAGING);
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('constructor should create Logger with correct name', () => {
    expect(loggerStub.args[0][0]).to.equal('ChannelApe API');
  });

  describe('logCall', () => {
    describe('given no error', () => {
      it('expect info to be called', () => {
        const requestCoreOptions: AxiosRequestConfig = {
          url: '/v1/orders',
          params: {
            size: 100
          }
        };
        requestLogger.logCall('GET', '/v1/orders', requestCoreOptions);
        expect(fakeLogger.info.called).to.be.true;
        expect(fakeLogger.info.args[0][0])
          .to.equal('GET https://staging-api.channelape.com/v1/orders?size=100 -- STARTED');
      });
    });
  });

  describe('logResponse', () => {
    describe('given an error', () => {
      it('expect info not to be called', () => {
        requestLogger.logResponse(new Error('error'), undefined, undefined);
        expect(fakeLogger.info.called).to.be.false;
      });

      it('expect error to be called', () => {
        requestLogger.logResponse(new Error('error'), undefined, undefined);
        expect(fakeLogger.error.called).to.be.true;
      });
    });

    describe('given no error', () => {
      it('given a 200 level response it should log the completed call as info', () => {
        requestLogger.logResponse(undefined, {
          status: 299,
          statusText: 'OK',
          config: {
            url: 'someurl',
            method: 'PUT'
          }
        } as any, undefined);
        expect(fakeLogger.info.called).to.be.true;
        expect(fakeLogger.info.args[0][0]).to.equal('PUT someurl -- COMPLETED');
      });

      it('given a non-200 level response it should log the correct error', () => {
        requestLogger.logResponse(undefined, {
          status: 504,
          statusText: 'Timeout',
          config: {
            url: 'someurl',
            method: 'PUT'
          }
        } as any, undefined);
        expect(fakeLogger.warn.called).to.be.true;
        expect(fakeLogger.warn.args[0][0]).to.equal('PUT someurl -- FAILED WITH STATUS: 504 and BODY OF: undefined');
      });

      it('expect error not to be called', () => {
        requestLogger.logResponse(undefined, undefined, undefined);
        expect(fakeLogger.error.called).to.be.false;
      });

      it('expect info to be called', () => {
        const response: any = {
          data: { status: 'ok!' },
          caseless: false,
          connection: null,
          headers: { 'Content-Type': 'application/json' },
          httpVersion: '5',
          httpVersionMajor: '5',
          httpVersionMinor: '5',
          status: 200,
          method: 'GET',
          config: {
            url: 'www.endpoint.com',
            method: 'GET'
          }
        };
        requestLogger.logResponse(undefined, response, undefined);
        expect(fakeLogger.info.called).to.be.true;
      });
    });
  });

  describe('logCallbackError', () => {
    describe('given an error', () => {
      it('expect error to be called', () => {
        requestLogger.logCallbackError(new Error('error'));
        expect(fakeLogger.error.called).to.be.true;
        expect(fakeLogger.error.args[0][0]).to.equal(`Your callback threw the following uncaught error: Error: error`);
      });
    });
  });
});
