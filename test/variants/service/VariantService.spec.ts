import VariantsService from '../../../src/variants/service/VariantsService';
import * as fs from 'fs';
import * as AppRootPath from 'app-root-path';
import { expect } from 'chai';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import LogLevel from '../../../src/model/LogLevel';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import Resource from '../../../src/model/Resource';
import Version from '../../../src/model/Version';
import VariantsRequestByProductId from '../../../src/variants/model/VariantsRequestByProductId';
import VariantsRequest from '../../../src/variants/model/VariantsRequest';
import VariantsSearchRequestByVendor from '../../../src/variants/model/VariantsSearchRequestByVendor';
import VariantsSearchRequestBySku from '../../../src/variants/model/VariantsSearchRequestBySku';
import VariantsSearchRequestByUpc from '../../../src/variants/model/VariantsSearchRequestByUpc';
import VariantsSearchRequestByProductFilterId from '../../../src/variants/model/VariantsSearchRequestByProductFilterId';
import VariantSearchDetails from '../../../src/variants/model/VariantSearchDetails';

const maximumRequestRetryTimeout = 300;

const quickSearchByProductFilterIdResults = [
  JSON.parse(fs.readFileSync(
    `${AppRootPath}/test/variants/resources/quickSearchByProductFilterIdResults/v1_products_variants_0.json`)
      .toString()),
  JSON.parse(fs.readFileSync(
    `${AppRootPath}/test/variants/resources/quickSearchByProductFilterIdResults/v1_products_variants_1.json`)
      .toString()),
  JSON.parse(fs.readFileSync(
    `${AppRootPath}/test/variants/resources/quickSearchByProductFilterIdResults/v1_products_variants_2.json`)
      .toString()),
  JSON.parse(fs.readFileSync(
    `${AppRootPath}/test/variants/resources/quickSearchByProductFilterIdResults/v1_products_variants_3.json`)
      .toString()),
  JSON.parse(fs.readFileSync(
    `${AppRootPath}/test/variants/resources/quickSearchByProductFilterIdResults/v1_products_variants_4.json`)
      .toString()),
  JSON.parse(fs.readFileSync(
    `${AppRootPath}/test/variants/resources/quickSearchByProductFilterIdResults/v1_products_variants_5.json`)
      .toString()),
  JSON.parse(fs.readFileSync(
    `${AppRootPath}/test/variants/resources/quickSearchByProductFilterIdResults/v1_products_variants_6.json`)
      .toString()),
];

const getVariantResult = JSON.parse(fs.readFileSync(
  `${AppRootPath}/test/variants/resources/v1_products_0744f2de-c62c-4b04-907f-26699463c0bd_variants_4820203.json`)
    .toString()
);

const getProductVariantsResult = JSON.parse(fs.readFileSync(
  `${AppRootPath}/test/variants/resources/v1_products_0744f2de-c62c-4b04-907f-26699463c0bd_variants.json`).toString()
);

const getVariantsBySku =
  JSON.parse(fs.readFileSync(`${AppRootPath}/test/variants/resources/v1_products_variants_skus_0.json`).toString());
const getVariantsByUpc =
  JSON.parse(fs.readFileSync(`${AppRootPath}/test/variants/resources/v1_products_variants_upcs_0.json`).toString());
const getVariantsByVendor =
  JSON.parse(fs.readFileSync(`${AppRootPath}/test/variants/resources/v1_products_variants_vendors_0.json`).toString());

const clientWrapper: RequestClientWrapper = new RequestClientWrapper({
  maximumRequestRetryTimeout,
  endpoint: Environment.STAGING,
  timeout: 60000,
  session: 'valid-session-id',
  logLevel: LogLevel.INFO,
  minimumRequestRetryRandomDelay: 50,
  maximumRequestRetryRandomDelay: 50,
  maximumConcurrentConnections: 5
});
const variantsService: VariantsService = new VariantsService(clientWrapper);

describe('VariantsService', () => {
  describe('Given some valid rest client', () => {
    describe('And valid productId', () => {
      context('When retrieving a products variants', () => {
        it('Then return variants for that product', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const variantsRequestByProductId: VariantsRequestByProductId = {
            productId: expectedProductId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const url =
            `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}/${expectedProductId}${Resource.VARIANTS}`;
          mockedAxiosAdapter.onGet(url)
            .reply(200, getProductVariantsResult);

          const actualVariantsPromise = variantsService.get(variantsRequestByProductId);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.equal(6);
          });
        });
      });

      context('When handling a network error', () => {
        it('Then return a rejected promise', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const variantsRequestByProductId: VariantsRequestByProductId = {
            productId: expectedProductId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const url =
            `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}/${expectedProductId}${Resource.VARIANTS}`;
          mockedAxiosAdapter.onGet(url).networkError();

          const actualVariantsPromise = variantsService.get(variantsRequestByProductId);
          return actualVariantsPromise
            .then(() => { throw new Error('Should not have resolved'); })
            .catch(e => expect(e.message).to.include('A problem with the ChannelApe API has been encountered.'));
        });
      });

      context('When handling a non 200 response', () => {
        it('Then return a rejected promise', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const variantsRequestByProductId: VariantsRequestByProductId = {
            productId: expectedProductId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const url =
            `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}/${expectedProductId}${Resource.VARIANTS}`;
          mockedAxiosAdapter.onGet(url)
            .reply(202, 'Something went wrong');

          const actualVariantsPromise = variantsService.get(variantsRequestByProductId);
          return actualVariantsPromise
            .then(() => { throw new Error('Should not have resolved'); })
            .catch(e => expect(e.message).to.include('Expected Status 200 but got 202'));
        });
      });
    });

    describe('And valid productId and valid variantId', () => {
      context('When retrieving a variant', () => {
        it('Then return that variant', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const expectedSku = '4820203';
          const variantsRequest: VariantsRequest = {
            productId: expectedProductId,
            inventoryItemValue: expectedSku
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}/${expectedProductId}${Resource.VARIANTS}/${expectedSku}`)
            .reply(200, getVariantResult);

          const actualVariantPromise = variantsService.get(variantsRequest);
          return actualVariantPromise.then((actualVariant) => {
            expect(actualVariant.options.Flavor).to.equal('Chocolate');
            expect(actualVariant.additionalFields.walmartBrand).to.equal('MusclePharm');
            expect(actualVariant.retailPrice).to.equal(59.99);
            expect(actualVariant.title).to.equal('MusclePharm Sport Series Combat XL Mass Gainer');
          });
        });
      });

      context('When handling a network error', () => {
        it('Then return a rejected promise', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const expectedSku = '4820203';
          const variantsRequest: VariantsRequest = {
            productId: expectedProductId,
            inventoryItemValue: expectedSku
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}/${expectedProductId}${Resource.VARIANTS}/${expectedSku}`)
            .networkError();

          const actualVariantsPromise = variantsService.get(variantsRequest);
          return actualVariantsPromise
            .then(() => { throw new Error('Should not have resolved'); })
            .catch(e => expect(e.message).to.include('A problem with the ChannelApe API has been encountered.'));
        });
      });

      context('When handling a non 200 response', () => {
        it('Then return a rejected promise', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const expectedSku = '4820203';
          const variantsRequest: VariantsRequest = {
            productId: expectedProductId,
            inventoryItemValue: expectedSku
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}/${expectedProductId}${Resource.VARIANTS}/${expectedSku}`)
            .reply(202, 'Something went wrong');

          const actualVariantsPromise = variantsService.get(variantsRequest);
          return actualVariantsPromise
            .then(() => { throw new Error('Should not have resolved'); })
            .catch(e => expect(e.message).to.include('Expected Status 200 but got 202'));
        });
      });
    });

    describe('And valid productId and valid variantId that needs to be URL encoded', () => {
      context('When retrieving a variant', () => {
        it('Then URL encode the variantId and return that variant', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const sku = '317-01-549-10/12';
          const urlEncodedSku = '317-01-549-10%2F12';
          const variantsRequest: VariantsRequest = {
            productId: expectedProductId,
            inventoryItemValue: sku
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}/${expectedProductId}${Resource.VARIANTS}/${urlEncodedSku}`)
            .reply(200, getVariantResult);

          const actualVariantPromise = variantsService.get(variantsRequest);
          return actualVariantPromise.then((actualVariant) => {
            expect(actualVariant.options.Flavor).to.equal('Chocolate');
            expect(actualVariant.additionalFields.walmartBrand).to.equal('MusclePharm');
            expect(actualVariant.retailPrice).to.equal(59.99);
            expect(actualVariant.title).to.equal('MusclePharm Sport Series Combat XL Mass Gainer');
          });
        });
      });
    });

    describe('And valid businessId and valid vendor', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedVendor = 'Optimum Nutrition';
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedSku = '2730117';
          const variantsRequest: VariantsSearchRequestByVendor = {
            vendor: expectedVendor,
            businessId: expectedBusinessId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}${Resource.VENDORS}`, {
            params: variantsRequest
          }).reply(200, getVariantsByVendor);

          const actualVariantsPromise = variantsService.search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            const variant = actualVariants.find(v => v.sku === expectedSku);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal(expectedVendor);
            expect(variant!.title).to.equal('Optimum Nutrition Opti-Women');
          });
        });
      });

      context('When handling a network error', () => {
        it('Then return a rejected promise', () => {
          const expectedVendor = 'Optimum Nutrition';
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const variantsRequest: VariantsSearchRequestByVendor = {
            vendor: expectedVendor,
            businessId: expectedBusinessId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}${Resource.VENDORS}`, {
            params: variantsRequest
          }).networkError();

          const actualVariantsPromise = variantsService.search(variantsRequest);
          return actualVariantsPromise
            .then(() => { throw new Error('Should not have resolved'); })
            .catch(e => expect(e.message).to.include('A problem with the ChannelApe API has been encountered.'));
        }).timeout(2000);
      });

      context('When handling a non 200 response', () => {
        it('Then return a rejected promise', () => {
          const expectedProductId = '0744f2de-c62c-4b04-907f-26699463c0bd';
          const variantsRequestByProductId: VariantsRequestByProductId = {
            productId: expectedProductId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const url =
            `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}/${expectedProductId}${Resource.VARIANTS}`;
          mockedAxiosAdapter.onGet(url)
            .reply(202, 'Something went wrong');

          const actualVariantsPromise = variantsService.get(variantsRequestByProductId);
          return actualVariantsPromise
            .then(() => { throw new Error('Should not have resolved'); })
            .catch(e => expect(e.message).to.include('Expected Status 200 but got 202'));
        });
      });

      context('When handling a non 200 response', () => {
        it('Then return a rejected promise', () => {
          const expectedVendor = 'Optimum Nutrition';
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const variantsRequest: VariantsSearchRequestByVendor = {
            vendor: expectedVendor,
            businessId: expectedBusinessId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}${Resource.VENDORS}`, {
            params: variantsRequest
          }).reply(202, 'Something went wrong');

          const actualVariantsPromise = variantsService.search(variantsRequest);
          return actualVariantsPromise
            .then(() => { throw new Error('Should not have resolved'); })
            .catch(e => expect(e.message).to.include('Expected Status 200 but got 202'));
        });
      });
    });

    describe('And valid productFilterId', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedProductFilterId = 'f4cf2afd-fc5f-424d-bf45-868b672d77a0';
          const expectedSku = '6030038';
          const variantsRequest: VariantsSearchRequestByProductFilterId = {
            productFilterId: expectedProductFilterId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}`, {
            params: variantsRequest
          }).reply(200, quickSearchByProductFilterIdResults[0]);
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}`, {
            params: { ...variantsRequest, lastKey: '34db1c4d-abc3-4b61-8549-2b8e2facedc2_9070050' }
          }).reply(200, quickSearchByProductFilterIdResults[1]);
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}`, {
            params: { ...variantsRequest, lastKey: '534c6064-5ff3-425a-a781-8a1ef7133565_9670004' }
          }).reply(200, quickSearchByProductFilterIdResults[2]);
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}`, {
            params: { ...variantsRequest, lastKey: '8202b91b-8418-4af9-a1ae-32e0397e1f5c_8310001' }
          }).reply(200, quickSearchByProductFilterIdResults[3]);
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}`, {
            params: { ...variantsRequest, lastKey: 'a78d7405-2bd0-4aa9-806f-64f5d66c2f9c_6860008' }
          }).reply(200, quickSearchByProductFilterIdResults[4]);
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}`, {
            params: { ...variantsRequest, lastKey: 'e0256c51-9a08-4576-a4ff-7f431652e442_9670015' }
          }).reply(200, quickSearchByProductFilterIdResults[5]);
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}`, {
            params: { ...variantsRequest, lastKey: 'fab69c5a-7977-42ba-ad17-73dfe3d7505b_8640010' }
          }).reply(200, quickSearchByProductFilterIdResults[6]);

          const actualVariantsPromise = variantsService.search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.be.greaterThan(50);
            const variant = actualVariants.find(v => v.sku === expectedSku);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal('Caveman Foods');
            expect(variant!.title).to.equal('Caveman Foods Chicken Jerky');
          });
        }).timeout(10000);
      });
    });

    describe('And valid businessId and valid sku', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedSku = '6030038';
          const variantsRequest: VariantsSearchRequestBySku = {
            sku: expectedSku,
            businessId: expectedBusinessId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}${Resource.SKUS}`, {
            params: variantsRequest
          }).reply(200, getVariantsBySku);

          const actualVariantsPromise = variantsService.search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.equal(1);
            const variant = actualVariants.find(v => v.sku === expectedSku);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal('Caveman Foods');
            expect(variant!.title).to.equal('Caveman Foods Chicken Jerky');
          });
        });
      });
    });

    describe('And valid businessId and valid upc', () => {
      context('When searching variants', () => {
        it('Then return variant quick search results', () => {
          const expectedBusinessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
          const expectedUpc = '853385003971';
          const variantsRequest: VariantsSearchRequestByUpc = {
            upc: expectedUpc,
            businessId: expectedBusinessId
          };

          const mockedAxiosAdapter = new axiosMockAdapter(axios);
          const baseUrl = `${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}`;
          mockedAxiosAdapter.onGet(`${baseUrl}${Resource.VARIANTS}${Resource.UPCS}`, {
            params: variantsRequest
          }).reply(200, getVariantsByUpc);

          const actualVariantsPromise = variantsService.search(variantsRequest);
          return actualVariantsPromise.then((actualVariants) => {
            expect(actualVariants).to.be.an('array');
            expect(actualVariants.length).to.equal(1);
            const variant = actualVariants.find(v => v.upc === expectedUpc);
            expect(variant!.businessId).to.equal(expectedBusinessId);
            expect(variant!.vendor).to.equal('Caveman Foods');
            expect(variant!.title).to.equal('Caveman Foods Chicken Jerky');
          });
        });
      });
    });

    it(`And valid businessId with multiple pages of variants
        and the singlePage option set to true
        When retrieving variants
        Then return resolved promise with a single page of variants`, () => {
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}/products/variants`).reply(200, {
        variantSearchResults: generateVariantSearchDetails(250),
        pagination: {
          lastPage: false,
          lastKey: '250_250',
          nextPageRef: 'v1/products/variants?productFilterId=test&lastKey=250_250&size=250',
          pageSize: 250,
          totalItems: 300
        }
      });

      const requestOptions: (VariantsSearchRequestByProductFilterId) = {
        productFilterId: 'something',
        size: 250
      };
      return variantsService.getPage(requestOptions).then((actualVariantsResponse) => {
        expect(actualVariantsResponse.variantSearchResults.length).to.equal(250);
        expect(actualVariantsResponse.pagination.lastPage).to.be.false;
      });
    });
  });
});

function generateVariantSearchDetails(size: number): VariantSearchDetails[] {
  const variants: VariantSearchDetails[] = [];

  for (let i = 0; i < size; i += 1) {
    variants.push({
      productId: `${i + 1}`,
      inventoryItemValue: `${i + 1}`,
      businessId: '',
      sku: '',
      upc: '',
      title: '',
      vendor: '',
      condition: '',
      primaryCategory: '',
      tags: [],
      grams: 0,
      currencyCode: '',
      retailPrice: 0,
      wholesalePrice: 0,
      quantity: 0
    });
  }
  return variants;
}
