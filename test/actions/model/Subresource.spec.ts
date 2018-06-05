import Subresource from '../../../src/actions/model/Subresource';
import { expect } from 'chai';

describe('Resources', () => {
  it('HEALTH_CHECK', () => {
    expect(Subresource.HEALTH_CHECK).to.equal('healthcheck');
  });
  it('COMPLETE', () => {
    expect(Subresource.COMPLETE).to.equal('complete');
  });
  it('ERROR', () => {
    expect(Subresource.ERROR).to.equal('error');
  });
});
