import { Versions } from '../../src/model/Versions';
import { expect } from 'chai';

describe('Versions', () => {
  it('Version 1', () => {
    expect(Versions.V1).to.equal('v1');
  });
});
