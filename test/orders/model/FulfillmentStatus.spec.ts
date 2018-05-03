import FulfillmentStatus from '../../../src/orders/model/FulfillmentStatus';
import { expect } from 'chai';

describe('FulfillmentStatus', () => {
  it('OPEN', () => {
    expect(FulfillmentStatus.OPEN).to.equal('OPEN');
  });

  it('IN_PROGRESS', () => {
    expect(FulfillmentStatus.IN_PROGRESS).to.equal('IN_PROGRESS');
  });

  it('CLOSED', () => {
    expect(FulfillmentStatus.CLOSED).to.equal('CLOSED');
  });
});
