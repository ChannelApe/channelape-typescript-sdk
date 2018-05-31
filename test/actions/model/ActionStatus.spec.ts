import { expect } from 'chai';
import ActionStatus from '../../../src/actions/model/ActionStatus';

describe('ActionStatus', () => {
  it('COMPLETED', () => {
    expect(ActionStatus.COMPLETED).to.equal('completed');
  });
  it('ERROR', () => {
    expect(ActionStatus.ERROR).to.equal('error');
  });
  it('IN_PROGRESS', () => {
    expect(ActionStatus.IN_PROGRESS).to.equal('inProgress');
  });
});
