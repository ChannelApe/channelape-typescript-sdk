import Resource from '../../src/model/Resource';
import { expect } from 'chai';

describe('Resources', () => {
  it('SESSIONS', () => {
    expect(Resource.SESSIONS).to.equal('/sessions');
  });
  it('ACTIONS', () => {
    expect(Resource.ACTIONS).to.equal('/actions');
  });
  it('CHANNELS', () => {
    expect(Resource.CHANNELS).to.equal('/channels');
  });
  it('ORDERS', () => {
    expect(Resource.ORDERS).to.equal('/orders');
  });
  it('PRODUCTS', () => {
    expect(Resource.PRODUCTS).to.equal('/products');
  });
  it('SKUS', () => {
    expect(Resource.SKUS).to.equal('/skus');
  });
  it('TAGS', () => {
    expect(Resource.TAGS).to.equal('/tags');
  });
  it('UPCS', () => {
    expect(Resource.UPCS).to.equal('/upcs');
  });
  it('VARIANTS', () => {
    expect(Resource.VARIANTS).to.equal('/variants');
  });
  it('VENDORS', () => {
    expect(Resource.VENDORS).to.equal('/vendors');
  });
  it('BUSINESSES', () => {
    expect(Resource.BUSINESSES).to.equal('/businesses');
  });
});
