import HttpRequestMethod from '../../src/model/HttpRequestMethod';
import { expect } from 'chai';

describe('HttpRequestMethod', () => {
  it('GET', () => {
    expect(HttpRequestMethod.GET).to.equal('GET');
  });
  it('PUT', () => {
    expect(HttpRequestMethod.PUT).to.equal('PUT');
  });
  it('POST', () => {
    expect(HttpRequestMethod.POST).to.equal('POST');
  });
  it('PATCH', () => {
    expect(HttpRequestMethod.PATCH).to.equal('PATCH');
  });
});
