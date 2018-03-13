import Response from '../../src/model/Response';
import { expect } from 'chai';

describe('Response', () => {
  it('given some populated body and status when creating response, then return response', () => {
    
    const expectedResponse = {
      statusCode: 200
    };

    const expectedData = {
      order: {
        id: 123,
        lineItems: [],
        fulfillments: [],
        purchasedAt: '2018-01-01T00:00:00'
      }
    };
    const actualResponse: any = new Response(expectedResponse, expectedData);
    expect(actualResponse).to.not.be.undefined;
    expect(actualResponse.getBody()).to.not.be.undefined;
    expect(actualResponse.getStatus()).to.not.be.undefined;
    expect(actualResponse.getBody()).to.deep.equal(expectedData);
    expect(actualResponse.getStatus()).to.deep.equal(expectedResponse.statusCode);
  });

});
