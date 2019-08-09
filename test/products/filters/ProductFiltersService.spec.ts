import RequestClientWrapper from '../../../src/RequestClientWrapper';
import LogLevel from '../../../src/model/LogLevel';
import Environment from '../../../src/model/Environment';
import ProductFiltersService from '../../../src/products/filters/service/ProductFiltersService';
import ProductFilterRequest from '../../../src/products/filters/models/ProductFilterRequest';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import Resource from '../../../src/model/Resource';
import Version from '../../../src/model/Version';
import ProductFilterApiResponse from '../../../src/products/filters/models/ProductFilterApiResponse';
import { expect } from 'chai';

const maximumRequestRetryTimeout = 3000;

const clientWrapper: RequestClientWrapper = new RequestClientWrapper({
  maximumRequestRetryTimeout,
  endpoint: Environment.STAGING,
  timeout: 60000,
  session: 'valid-session-id',
  logLevel: LogLevel.INFO,
  minimumRequestRetryRandomDelay: 50,
  maximumRequestRetryRandomDelay: 50
});
const productFiltersService: ProductFiltersService = new ProductFiltersService(clientWrapper);

describe('ProductFiltersService', () => {
  describe('Given some valid rest client', () => {
    it('And valid ProductFilterRequest when creating a filter, Then return created filter', () => {
      const productFilterRequest: ProductFilterRequest = {
        businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4'
      };
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPost(`${Environment.STAGING}/${Version.V1}${Resource.PRODUCTS}${Resource.FILTERS}`)
        .reply((data) => {
          return Promise.resolve([201, <ProductFilterApiResponse> {
            alphabeticCurrencyCode: 'USD',
            businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
            complement: false,
            createdAt: '2019-08-07T16:16:50.064Z',
            errors: [],
            id: '7f46e575-ef3d-403d-8c72-5a971e5ba6b3',
            skus: [],
            tags: [],
            upcs: [],
            updatedAt: '2019-08-07T16:16:50.064Z',
            vendors: []
          }]);
        });

      return productFiltersService.create(productFilterRequest).then((createdFilter) => {
        expect(createdFilter.id).to.equal('7f46e575-ef3d-403d-8c72-5a971e5ba6b3', 'filter.id');
        expect(createdFilter.alphabeticCurrencyCode).to.equal('USD', 'alphabeticCurrencyCode');
        expect(createdFilter.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4', 'businessId');
        expect(createdFilter.complement).to.equal(false, 'complement');
        expect(createdFilter.createdAt.getTime()).to.equal(new Date('2019-08-07T16:16:50.064Z').getTime(), 'createdAt');
        expect(createdFilter.errors.length).to.equal(0, 'errors');
        expect(createdFilter.skus.length).to.equal(0, 'skus');
        expect(createdFilter.tags.length).to.equal(0, 'tags');
        expect(createdFilter.upcs.length).to.equal(0, 'upcs');
        expect(createdFilter.updatedAt.getTime()).to.equal(new Date('2019-08-07T16:16:50.064Z').getTime(), 'updatedAt');
        expect(createdFilter.vendors.length).to.equal(0, 'vendors');
      });
    });
  });
});
