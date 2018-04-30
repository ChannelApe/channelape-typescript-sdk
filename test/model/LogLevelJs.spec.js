const LogLevel = require('../../src/model/LogLevel').LogLevel;
const getLogLevelName = require('../../src/model/LogLevel').getLogLevelName;
const chai = require('chai');

describe('LogLevel JS', () => {
  describe('getLogLevelName()', () => {
    describe('Given null as a parameter', () => {
      it('Then expect "OFF" to be returned', () => {
        chai.expect(getLogLevelName()).to.equal('OFF');
      });
    });
    describe('Given an empty string as a parameter', () => {
      it('Then expect "OFF" to be returned', () => {
        chai.expect(getLogLevelName('')).to.equal('OFF');
      });
    });
  });
});
