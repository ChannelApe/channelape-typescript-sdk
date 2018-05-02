import Version  from '../../src/model/Version';
import { expect } from 'chai';

describe('Versions', () => {
  it('Version 1', () => {
    expect(Version.V1).to.equal('v1');
  });
});
