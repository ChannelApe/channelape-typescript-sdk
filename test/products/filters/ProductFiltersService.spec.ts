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
  maximumRequestRetryRandomDelay: 50,
  maximumConcurrentConnections: 5
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
            vendors: [],
            label: 'test-label',
            title: 'test-title',
            condition: 'test-condition',
            primaryCondition: 'test-primary',
            secondaryCondition: 'test-secondary',
            weightMin: 'test-weight-min',
            weightMax: 'test-weight-max',
            retailMin: 'test-retail-min',
            retailMax: 'test-retail-max',
            wholesaleMin: 'test-wholesale-min',
            wholesaleMax: 'test-wholesale-max',
            quantityMin: 1,
            quantityMax: 5
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
        expect(createdFilter.label).to.equal('test-label', 'label');
        expect(createdFilter.title).to.equal('test-title', 'title');
        expect(createdFilter.condition).to.equal('test-condition', 'condition');
        expect(createdFilter.primaryCondition).to.equal('test-primary', 'primaryCondition');
        expect(createdFilter.secondaryCondition).to.equal('test-secondary', 'secondaryCondition');
        expect(createdFilter.weightMin).to.equal('test-weight-min', 'weightMin');
        expect(createdFilter.weightMax).to.equal('test-weight-max', 'weightMax');
        expect(createdFilter.retailMin).to.equal('test-retail-min', 'retailMin');
        expect(createdFilter.retailMax).to.equal('test-retail-max', 'retailMax');
        expect(createdFilter.wholesaleMin).to.equal('test-wholesale-min', 'wholesaleMin');
        expect(createdFilter.wholesaleMax).to.equal('test-wholesale-max', 'wholesaleMax');
        expect(createdFilter.quantityMin).to.equal(1, 'quantityMin');
        expect(createdFilter.quantityMax).to.equal(5, 'quantityMax');
      });
    });
  });
});
