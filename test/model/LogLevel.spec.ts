import { expect } from 'chai';

import LogLevel from '../../src/model/LogLevel';

describe('LogLevel', () => {
  it('OFF', () => {
    expect(LogLevel.OFF).to.equal('off');
  });

  it('ERROR', () => {
    expect(LogLevel.ERROR).to.equal('error');
  });

  it('WARN', () => {
    expect(LogLevel.WARN).to.equal('warn');
  });

  it('INFO', () => {
    expect(LogLevel.INFO).to.equal('info');
  });

  it('VERBOSE', () => {
    expect(LogLevel.VERBOSE).to.equal('verbose');
  });

  it('DEBUG', () => {
    expect(LogLevel.DEBUG).to.equal('debug');
  });
});
