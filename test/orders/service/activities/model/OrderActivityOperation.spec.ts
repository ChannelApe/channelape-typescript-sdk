import OrderActivityOperation from '../../../../../src/orders/service/activities/model/OrderActivityOperation';
import { expect } from 'chai';

describe('OrderActivityOperation', () => {
  it('CREATE', () => {
    expect(OrderActivityOperation.CREATE).to.equal('CREATE');
  });

  it('DELETE', () => {
    expect(OrderActivityOperation.DELETE).to.equal('DELETE');
  });

  it('UPDATE', () => {
    expect(OrderActivityOperation.UPDATE).to.equal('UPDATE');
  });
});
