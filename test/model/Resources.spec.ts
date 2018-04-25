import Resource from '../../src/model/Resource';
import { expect } from 'chai';

describe('Resources', () => {
  it('SESSIONS', () => {
    expect(Resource.SESSIONS).to.equal('/sessions');
  });
});
