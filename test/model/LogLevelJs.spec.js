const LogLevel = require('../../src/model/LogLevel').LogLevel;
const getLogLevelName = require('../../src/model/LogLevel').getLogLevelName;
const chai = require('chai');

describe('LogLevel JS', () => {
  describe('getLogLevelName()', () => {
    describe('Given null or \'\' as a parameter', () => {
      it('Then expect "OFF"', () => {
        chai.expect(getLogLevelName()).to.equal('OFF');
      });
    });
  });
});
