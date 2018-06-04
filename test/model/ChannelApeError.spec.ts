// tslint:disable:no-trailing-whitespace
import ChannelApeError  from '../../src/model/ChannelApeError';
import ChannelApeApiError from '../../src/model/ChannelApeApiError';
import { expect } from 'chai';

describe('ChannelApeError', () => {
  const responseDefined = {
    statusCode: 505,
    statusMessage: 'Something blew up',
    method: 'PUT'
  };
  const responseUndefined = {};

  context('given an array of ChannelApeApiError(s) and a response with statusCode and statusMessage defined', () => {
    it('should instantiate an object that extends the generic error class and formats the message propery', () => {
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
    and a response with statusCode and statusMessage undefined`, () => {
    it('should instantiate an object that extends the generic error class and formats the message propery', () => {
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
});
