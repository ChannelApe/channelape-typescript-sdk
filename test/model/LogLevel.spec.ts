import { LogLevel, getLogLevelName } from '../../src/model/LogLevel';
import { expect } from 'chai';

describe('LogLevel', () => {
  it('Levels', () => {
    expect(LogLevel.OFF).to.equal(-1, 'OFF LogLevel value');
    expect(LogLevel.ERROR).to.equal(0, 'ERROR LogLevel value');
    expect(LogLevel.WARN).to.equal(1, 'WARN LogLevel value');
    expect(LogLevel.INFO).to.equal(2, 'INFO LogLevel value');
    expect(LogLevel.VERBOSE).to.equal(3, 'VERBOSE LogLevel value');
    expect(LogLevel.DEBUG).to.equal(4, 'DEBUG LogLevel value');
  });

  it('should return a human readable name for each level', () => {
    expect(getLogLevelName(LogLevel.OFF)).to.equal('OFF');
    expect(getLogLevelName(LogLevel.ERROR)).to.equal('ERROR');
    expect(getLogLevelName(LogLevel.WARN)).to.equal('WARN');
    expect(getLogLevelName(LogLevel.INFO)).to.equal('INFO');
    expect(getLogLevelName(LogLevel.VERBOSE)).to.equal('VERBOSE');
    expect(getLogLevelName(LogLevel.DEBUG)).to.equal('DEBUG');
  });
});
