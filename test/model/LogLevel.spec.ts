import { LogLevel } from '../../src/model/LogLevel';
import { expect } from 'chai';

describe('LogLevel', () => {
  describe('ENUM', () => {
    it('Levels', () => {
      expect(LogLevel.OFF).to.equal('off', 'OFF LogLevel value');
      expect(LogLevel.ERROR).to.equal('error', 'ERROR LogLevel value');
      expect(LogLevel.WARN).to.equal('warn', 'WARN LogLevel value');
      expect(LogLevel.INFO).to.equal('info', 'INFO LogLevel value');
      expect(LogLevel.VERBOSE).to.equal('verbose', 'VERBOSE LogLevel value');
      expect(LogLevel.DEBUG).to.equal('debug', 'DEBUG LogLevel value');
    });
  });
});
