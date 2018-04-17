import Endpoint from '../../src/model/Endpoint';
import { expect } from 'chai';

describe('Endpoints', () => {
  it('SESSIONS', () => {
    expect(Endpoint.SESSIONS).to.equal('/sessions');
  });
});
