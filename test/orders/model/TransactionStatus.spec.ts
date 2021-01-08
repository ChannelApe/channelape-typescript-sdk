import TransactionStatus from '../../../src/orders/model/TransactionStatus';
import { expect } from 'chai';

describe('TransactionStatus', () => {
  it('PENDING', () => {
    expect(TransactionStatus.PENDING).to.equal('PENDING');
  });

  it('SUCCESS', () => {
    expect(TransactionStatus.SUCCESS).to.equal('SUCCESS');
  });

  it('FAILURE', () => {
    expect(TransactionStatus.FAILURE).to.equal('FAILURE');
  });

  it('CANCELED', () => {
    expect(TransactionStatus.ERROR).to.equal('ERROR');
  });
});
