import { expect } from 'chai';
import QueryUtils from '../../src/utils/QueryUtils';

describe('QueryUtils', () => {

  describe('getDateQueryParameter', () => {
    describe('Given date of "Thu May 03 2018 14:07:58 GMT-0400 (Eastern Daylight Time)"', () => {
      it('Expect query parameter string of "2018-05-03T18:07:58.009Z"', () => {
        const date = new Date('2018-05-03T18:07:58.009Z');
        const expectedDateQueryParam = '2018-05-03T18:07:58.009Z';
        const actualDateQueryParam = QueryUtils.getDateQueryParameter(date);
        expect(actualDateQueryParam).to.equal(expectedDateQueryParam);
      });
    });
  });

});
