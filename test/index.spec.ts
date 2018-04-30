import * as ChannelApe from '../src/index';
import { expect } from 'chai';

describe('Index', () => {
  it('Expect LogLevel to be exported', () => {
    expect(ChannelApe.LogLevel).to.equal(ChannelApe.LogLevel);
  });
});
