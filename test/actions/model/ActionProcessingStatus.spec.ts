import { expect } from 'chai';
import ActionProcessingStatus from '../../../src/actions/model/ActionProcessingStatus';

describe('ActionStatus', () => {
  it('COMPLETED', () => {
    expect(ActionProcessingStatus.COMPLETED).to.equal('completed');
  });
  it('ERROR', () => {
    expect(ActionProcessingStatus.ERROR).to.equal('error');
  });
  it('IN_PROGRESS', () => {
    expect(ActionProcessingStatus.IN_PROGRESS).to.equal('inProgress');
  });
});
