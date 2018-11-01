import InventoryItemKey from '../../src/model/InventoryItemKey';
import { expect } from 'chai';

describe('InventoryItemKey', () => {
  it('SKU', () => {
    expect(InventoryItemKey.SKU).to.equal('SKU');
  });
  it('UPC', () => {
    expect(InventoryItemKey.UPC).to.equal('UPC');
  });
});
