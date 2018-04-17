import Environment from '../../src/model/Environment';
import { expect } from 'chai';

describe('Environments', () => {
  it('PRODUCTION', () => {
    expect(Environment.PRODUCTION).to.equal('https://api.channelape.com');
  });
  it('STAGING', () => {
    expect(Environment.STAGING).to.equal('https://staging-api.channelape.com');
  });
});
