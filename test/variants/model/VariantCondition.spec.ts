import VariantCondition from '../../../src/variants/model/VariantCondition';
import { expect } from 'chai';

describe('VariantCondition', () => {
  it('NEW', () => {
    expect(VariantCondition.NEW).to.equal('NEW');
  });

  it('REFURBISHED', () => {
    expect(VariantCondition.REFURBISHED).to.equal('REFURBISHED');
  });

  it('USED', () => {
    expect(VariantCondition.USED).to.equal('USED');
  });
});
