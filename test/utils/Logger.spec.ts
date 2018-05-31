import * as sinon from 'sinon';
import { expect } from 'chai';
import Logger from '../../src/utils/Logger';
import LogLevel from '../../src/model/LogLevel';
import * as winston from 'winston';

describe('Logger', () => {

  let logger: Logger;
  let sandbox: sinon.SinonSandbox;
  let winstonStub: sinon.SinonStub;
  let fakeWinston: any;
  let fakeTransports: any;

  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    fakeWinston = {
      error: sinon.spy(),
      warn: sinon.spy(),
      info: sinon.spy(),
      debug: sinon.spy()
    };
    fakeTransports = {
      Console: sinon.spy()
    };
    winstonStub = sandbox.stub(winston, 'Logger').returns(fakeWinston);
    logger = new Logger('LogName', LogLevel.VERBOSE);
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('constructor should create winston logger with correct formatter set', () => {
    const options = {
      message: 'message',
      level: 'error'
    };
    expect(winstonStub.args[0][0].transports[0].formatter(options)).to.include('[ERROR] message');
  });

  it('error() should log when logLevel is ERROR or above', () => {
    logger.error('ERROR');
    const expectedMessage = '[LogName] - ERROR';
    expect(fakeWinston.error.called).to.be.true;
    expect(fakeWinston.error.args[0][0]).to.equal(expectedMessage);
  });

  it('warn() should log when logLevel is WARN or above', () => {
    logger.warn('WARN');
    const expectedMessage = '[LogName] - WARN';
    expect(fakeWinston.warn.called).to.be.true;
    expect(fakeWinston.warn.args[0][0]).to.equal(expectedMessage);
  });

  it('info() should log when logLevel is INFO or above', () => {
    logger.info('INFO');
    const expectedMessage = '[LogName] - INFO';
    expect(fakeWinston.info.called).to.be.true;
    expect(fakeWinston.info.args[0][0]).to.equal(expectedMessage);
  });

  it('debug() should log when logLevel is DEBUG or above', () => {
    logger.debug('DEBUG');
    const expectedMessage = '[LogName] - DEBUG';
    expect(fakeWinston.debug.called).to.be.true;
    expect(fakeWinston.debug.args[0][0]).to.equal(expectedMessage);
  });
});
