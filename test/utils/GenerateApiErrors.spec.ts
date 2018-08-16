import { expect } from 'chai';
import GenerateApiError from '../../src/utils/GenerateApiError';
import { AxiosResponse } from '../../node_modules/axios';

describe('GenerateApiErrors()', () => {

  const response = {
    status: 505,
    config: {
      method: 'GET'
    }
  };

  context('given a body that is undefined', () => {
    it('should return a new ChannelApeError object with an empty array of ApiErrors', () => {
      const cae = GenerateApiError('www.ca.com', response as AxiosResponse, undefined, 200);
      expect(cae.ApiErrors).to.be.an('array');
      expect(cae.ApiErrors.length).to.equal(0);
    });
  });

  context('given a body with the errors property undefined', () => {
    it('should return a new ChannelApeError object with an empty array of ApiErrors', () => {
      const cae = GenerateApiError('www.ca.com', response as AxiosResponse, {}, 200);
      expect(cae.ApiErrors).to.be.an('array');
      expect(cae.ApiErrors.length).to.equal(0);
    });
  });

  context('given a status code of 505 but an expected status code of 200', () => {
    it('should return a new ChannelApeError object with a message that includes the status and expected status', () => {
      const cae = GenerateApiError('www.ca.com', response as AxiosResponse, { statusCode: 505 }, 200);
      const expectedErrorMessage = 'Expected Status 200 but got 505';
      expect(cae.message).to.include(expectedErrorMessage);
    });
  });
});
