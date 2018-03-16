import { Endpoints } from '../../src/model/Endpoints';
import { expect } from 'chai';

describe('Endpoints', () => {
  it('SESSIONS', () => {
    expect(Endpoints.SESSIONS).to.equal('/sessions');
  });

  it('ORDERS', () => {
    expect(Endpoints.ORDERS).to.equal('/orders');
  });
});
