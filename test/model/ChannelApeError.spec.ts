// tslint:disable:no-trailing-whitespace
import ChannelApeError  from '../../src/model/ChannelApeError';
import ChannelApeApiError from '../../src/model/ChannelApeApiError';
import { expect } from 'chai';

describe('ChannelApeError', () => {
  const responseDefined = {
    status: 505,
    statusText: 'Something blew up',
    method: 'PUT',
    config: {
      method: 'PUT'
    }
  };
  const responseUndefined = {};

  context('given an array of ChannelApeApiError(s) and a response with statusCode and statusText defined', () => {
    it('should instantiate an object that extends the generic error class and formats the message property', () => {
      const expectedErrorMessage =
`PUT www.ca.com
  Status: 505 Something blew up
  Response Body:
  This is an error
Code: 22 Message: The API did not like your parameters
Code: 99 Message: The API could not handle your request`;
      const channelApeApiErrors: ChannelApeApiError[] = [
        { code: 22, message: 'The API did not like your parameters' },
        { code: 99, message: 'The API could not handle your request' }
      ];
      const cae = new ChannelApeError('This is an error', responseDefined as any, 'www.ca.com', channelApeApiErrors);
      expect(cae.message).to.equal(expectedErrorMessage);
    });
  });

  context(`given an empty array of ChannelApeApiError(s)
    and a response with statusCode and statusText undefined`, () => {
    it('should instantiate an object that extends the generic error class and formats the message property', () => {
      const expectedErrorMessage =
` www.ca.com
  Status: 0
  Response Body:
  This is an error`;
      const channelApeApiErrors: ChannelApeApiError[] = [];
      const cae = new ChannelApeError('This is an error', responseUndefined as any, 'www.ca.com', channelApeApiErrors);
      expect(cae.message).to.equal(expectedErrorMessage);
    });
  });

  context(`given an unrecoverable error occurred with the ChannelApe API`, () => {
    it('should return error with status code of -1 and status message of "There was an error with the API"', () => {
      const cae = new ChannelApeError('This is an error', undefined as any, 'www.ca.com', []);
      expect(cae.Response.statusCode).to.equal(-1);
      expect(cae.Response.statusMessage).to.equal('There was an error with the API');
    });
  });

  context(`given an empty response from the ChannelApe API`, () => {
    it('should return error with status code of -1 and status message of "There was an error with the API"', () => {
      const cae = new ChannelApeError('This is an error', {} as any, 'www.ca.com', []);
      expect(cae.Response.statusCode).to.equal(-1);
      expect(cae.Response.statusMessage).to.equal('There was an error with the API');
    });
  });
});
