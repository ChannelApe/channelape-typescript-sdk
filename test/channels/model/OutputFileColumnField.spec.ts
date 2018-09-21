import OutputFileColumnField from '../../../src/channels/model/OutputFileColumnField';
import { expect } from 'chai';

describe('OutputFileColumnField', () => {
  it('PRODUCT_ID', () => { expect(OutputFileColumnField.PRODUCT_ID).to.equal('productId'); });
  it('INVENTORY_ITEM_VALUE', () => {
    expect(OutputFileColumnField.INVENTORY_ITEM_VALUE).to.equal('inventoryItemValue');
  });
  it('SKU', () => { expect(OutputFileColumnField.SKU).to.equal('sku'); });
  it('UPC', () => { expect(OutputFileColumnField.UPC).to.equal('upc'); });
  it('PRODUCT_TITLE', () => { expect(OutputFileColumnField.PRODUCT_TITLE).to.equal('productTitle'); });
  it('PRODUCT_DESCRIPTION', () => {
    expect(OutputFileColumnField.PRODUCT_DESCRIPTION).to.equal('productDescription');
  });
  it('PRODUCT_PRIMARY_CATEGORY', () => {
    expect(OutputFileColumnField.PRODUCT_PRIMARY_CATEGORY).to.equal('productPrimaryCategory');
  });
  it('PRODUCT_SECONDARY_CATEGORY', () => {
    expect(OutputFileColumnField.PRODUCT_SECONDARY_CATEGORY).to.equal('productSecondaryCategory');
  });
  it('PRODUCT_VENDER', () => { expect(OutputFileColumnField.PRODUCT_VENDER).to.equal('productVendor'); });
  it('OPTION_VALUE', () => { expect(OutputFileColumnField.OPTION_VALUE).to.equal('optionValue'); });
  it('PRODUCT_IMAGE', () => { expect(OutputFileColumnField.PRODUCT_IMAGE).to.equal('productImage'); });
  it('PRODUCT_TAGS', () => { expect(OutputFileColumnField.PRODUCT_TAGS).to.equal('productTags'); });
  it('TITLE', () => { expect(OutputFileColumnField.TITLE).to.equal('title'); });
  it('DESCRIPTION', () => { expect(OutputFileColumnField.DESCRIPTION).to.equal('description'); });
  it('PRIMARY_CATEGORY', () => { expect(OutputFileColumnField.PRIMARY_CATEGORY).to.equal('primaryCategory'); });
  it('SECONDARY_CATEGORY', () => { expect(OutputFileColumnField.SECONDARY_CATEGORY).to.equal('secondaryCategory'); });
  it('VENDOR', () => { expect(OutputFileColumnField.VENDOR).to.equal('vendor'); });
  it('QUANTITY', () => { expect(OutputFileColumnField.QUANTITY).to.equal('quantity'); });
  it('WEIGHT', () => { expect(OutputFileColumnField.WEIGHT).to.equal('weight'); });
  it('ALPHABETIC_CURRENCY_CODE', () => {
    expect(OutputFileColumnField.ALPHABETIC_CURRENCY_CODE).to.equal('alphabeticCurrencyCode');
  });
  it('RETAIL_PRICE', () => { expect(OutputFileColumnField.RETAIL_PRICE).to.equal('retailPrice'); });
  it('WHOLESALE_PRICE', () => { expect(OutputFileColumnField.WHOLESALE_PRICE).to.equal('wholesalePrice'); });
  it('CONDITION', () => { expect(OutputFileColumnField.CONDITION).to.equal('condition'); });
  it('IMAGE', () => { expect(OutputFileColumnField.IMAGE).to.equal('image'); });
  it('TAGS', () => { expect(OutputFileColumnField.TAGS).to.equal('tags'); });
  it('ADDITIONAL_FIELD_VALUE', () => {
    expect(OutputFileColumnField.ADDITIONAL_FIELD_VALUE).to.equal('additionalFieldValue');
  });
});
