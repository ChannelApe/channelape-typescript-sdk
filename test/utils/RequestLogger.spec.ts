import * as sinon from 'sinon';
import { expect } from 'chai';
import * as Logger from '../../src/utils/Logger';
import LogLevel from '../../src/model/LogLevel';
import RequestLogger from '../../src/utils/RequestLogger';
import { Response } from 'request';

describe('Logger', () => {

  let requestLogger: RequestLogger;
  let sandbox: sinon.SinonSandbox;
  let loggerStub: sinon.SinonStub;
  let fakeLogger: any;

  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    fakeLogger = {
      info: sinon.spy(),
      warn: sinon.spy(),
      error: sinon.spy(),
      debug: sinon.spy()
    };
    loggerStub = sandbox.stub(Logger, 'default').returns(fakeLogger);
    requestLogger = new RequestLogger(LogLevel.VERBOSE);
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('constructor should create Logger with correct name', () => {
    expect(loggerStub.args[0][0]).to.equal('ChannelApe API');
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
      it('expect error not to be called', () => {
        requestLogger.logResponse(undefined, undefined, undefined);
        expect(fakeLogger.error.called).to.be.false;
      });

      it('expect info to be called', () => {
        const response: any = {
          body: { status: 'ok!' },
          caseless: false,
          connection: null,
          headers: { 'Content-Type': 'application/json' },
          httpVersion: '5',
          httpVersionMajor: '5',
          httpVersionMinor: '5',
          statusCode: 200,
          method: 'GET'
        };
        requestLogger.logResponse(undefined, response, undefined);
        expect(fakeLogger.info.called).to.be.true;
      });
    });
  });
});
