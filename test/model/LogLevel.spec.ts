import { LogLevel, getLogLevelName } from '../../src/model/LogLevel';
import { expect } from 'chai';

describe('LogLevel', () => {
  describe('ENUM', () => {
    it('Levels', () => {
      expect(LogLevel.OFF).to.equal(-1, 'OFF LogLevel value');
      expect(LogLevel.ERROR).to.equal(0, 'ERROR LogLevel value');
      expect(LogLevel.WARN).to.equal(1, 'WARN LogLevel value');
      expect(LogLevel.INFO).to.equal(2, 'INFO LogLevel value');
      expect(LogLevel.VERBOSE).to.equal(3, 'VERBOSE LogLevel value');
      expect(LogLevel.DEBUG).to.equal(4, 'DEBUG LogLevel value');
    });
  });

  describe('getLogLevelName', () => {
    describe('Given LogLevel.OFF', () => {
      it('Then expect "OFF"', () => {
        expect(getLogLevelName(LogLevel.OFF)).to.equal('OFF');
      });
    });
    describe('Given LogLevel.ERROR', () => {
      it('Then expect "ERROR"', () => {
        expect(getLogLevelName(LogLevel.ERROR)).to.equal('ERROR');
      });
    });
    describe('Given LogLevel.WARN', () => {
      it('Then expect "WARN"', () => {
        expect(getLogLevelName(LogLevel.WARN)).to.equal('WARN');
      });
    });
    describe('Given LogLevel.INFO', () => {
      it('Then expect "INFO"', () => {
        expect(getLogLevelName(LogLevel.INFO)).to.equal('INFO');
      });
    });
    describe('Given LogLevel.VERBOSE', () => {
      it('Then expect "VERBOSE"', () => {
        expect(getLogLevelName(LogLevel.VERBOSE)).to.equal('VERBOSE');
      });
    });
    describe('Given LogLevel.DEBUG', () => {
      it('Then expect "DEBUG"', () => {
        expect(getLogLevelName(LogLevel.DEBUG)).to.equal('DEBUG');
      });
    });
  });
});
