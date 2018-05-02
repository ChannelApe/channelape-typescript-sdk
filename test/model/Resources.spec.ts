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
});
