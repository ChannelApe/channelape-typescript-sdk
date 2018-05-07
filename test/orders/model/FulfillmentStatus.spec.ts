import FulfillmentStatus from '../../../src/orders/model/FulfillmentStatus';
import { expect } from 'chai';

describe('FulfillmentStatus', () => {
  it('PENDING', () => {
    expect(FulfillmentStatus.PENDING).to.equal('PENDING');
  });

  it('OPEN', () => {
    expect(FulfillmentStatus.OPEN).to.equal('OPEN');
  });

  it('SUCCESS', () => {
    expect(FulfillmentStatus.SUCCESS).to.equal('SUCCESS');
  });

  it('CANCELED', () => {
    expect(FulfillmentStatus.CANCELED).to.equal('CANCELED');
  });
});
