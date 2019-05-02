import OrderActivityResult from '../../../../../src/orders/service/activities/model/OrderActivityResult';
import { expect } from 'chai';

describe('OrderActivityResult', () => {
  it('ERROR', () => {
    expect(OrderActivityResult.ERROR).to.equal('ERROR');
  });

  it('SUCCESS', () => {
    expect(OrderActivityResult.SUCCESS).to.equal('SUCCESS');
  });

  it('WARNING', () => {
    expect(OrderActivityResult.WARNING).to.equal('WARNING');
  });

  it('UNCHANGED', () => {
    expect(OrderActivityResult.UNCHANGED).to.equal('UNCHANGED');
  });
});
