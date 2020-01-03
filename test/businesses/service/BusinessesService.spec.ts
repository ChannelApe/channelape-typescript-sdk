import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import BusinessesService from './../../../src/businesses/service/BusinessesService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import Business from '../../../src/businesses/model/Business';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import { ChannelApeError, AlphabeticCurrencyCode, InventoryItemKey, TimeZoneId } from '../../../src/index';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';

import singleBusiness from '../resources/singleBusiness';
import BusinessCreateRequest from '../../../src/businesses/model/BusinessCreateRequest';

describe('Businesses Service', () => {

  describe('Given some rest client', () => {
    const client: RequestClientWrapper =
      new RequestClientWrapper({
        endpoint: Environment.STAGING,
        maximumRequestRetryTimeout: 10000,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: 50,
        maximumRequestRetryRandomDelay: 50,
        maximumConcurrentConnections: 5
      }, axios);
    const businessesService: BusinessesService = new BusinessesService(client);

    let sandbox: sinon.SinonSandbox;

    const expectedBusiness: Business = {
      alphabeticCurrencyCode: AlphabeticCurrencyCode.USD,
      embeds: [],
      errors: [],
      id: '875c3408-a08f-4782-8da2-533f496dd439',
      inventoryItemKey: InventoryItemKey.SKU,
      name: 'Test Business 1',
      timeZone: TimeZoneId.US_EASTERN
    };

    const expectedBusiness2: Business = {
      alphabeticCurrencyCode: AlphabeticCurrencyCode.AUD,
      embeds: [],
      errors: [],
      id: 'cbf375a0-a5e1-4052-964a-bc35f717fc64',
      inventoryItemKey: InventoryItemKey.UPC,
      name: 'Test Business 2',
      timeZone: TimeZoneId.AUSTRALIA_BRISBANE
    };

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'No businesses could be found.'
        }
      ]
    };

    const expectedError = {
      stack: 'oh no an error'
    };

    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it('And valid user ID ' +
      'When retrieving businesses Then return resolved promise with businesses', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, { errors: [], businesses: [expectedBusiness, expectedBusiness2] });

      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.get({ userId: 'valid-user-id' }).then((actualBusinessesResponse) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.BUSINESSES}`);
        expect(clientGetStub.args[0][1].params.userId).to.equal('valid-user-id');
        expectBusiness(actualBusinessesResponse[0]);
      });
    });

    it('And valid business ID ' +
      'When retrieving businesses Then return resolved promise with business', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedBusiness);

      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.get({ businessId: 'valid-business-id' }).then((actualBusinessesResponse) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/valid-business-id`);
        expectBusiness(actualBusinessesResponse);
      });
    });

    it('And valid user ID And request connect errors ' +
      'When retrieving businesses Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.get({ userId: 'valid-user-id' }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid user ID ' +
      'When retrieving businesses Then return a rejected promise with 404 status code ' +
      'And business not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.get({ businessId: expectedBusiness.id }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${expectedBusiness.id}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it('And invalid user ID ' +
      'When retrieving businesses Then return a rejected promise with 404 status code ' +
      'And an error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.get({ userId: 'invalid-user-id' }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it('And valid Business when creating a business, Then return created business', () => {
      const newBusiness: BusinessCreateRequest = JSON.parse(JSON.stringify(singleBusiness));

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPost(`${Environment.STAGING}/${Version.V1}${Resource.BUSINESSES}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([201, newBusiness]);
        });

      return businessesService.create(newBusiness).then((createdBusiness) => {
        expect(createdBusiness.id).to.equal('62096199-0aa4-4ebb-bab0-8bd887507265', 'business.id');
        expect(createdBusiness.timeZone).to.equal(TimeZoneId.AMERICA_NEW_YORK, 'timezone');
        expect(createdBusiness.name).to.equal('Some Test Business Name', 'name');
        expect(createdBusiness.inventoryItemKey).to.equal(InventoryItemKey.SKU, 'inventoryItemKey');
        expect(createdBusiness.alphabeticCurrencyCode)
          .to.equal(AlphabeticCurrencyCode.USD, 'alphabeticCurrencyCode');
      });
    });

    it(`And valid business ID and user ID when retrieving user's business access configuration,
      Then return user's business access configuration`, () => {
      const businessId = 'valid-business-id';
      const userId = 'valid-user-id';
      const expectedOwnerValue = true;

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      const params = {
        businessId,
        userId
      };
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.BUSINESSES}`, params)
        .reply(200, {
          businessId,
          userId,
          owner: expectedOwnerValue
        });

      const request = {
        businessId,
        userId
      };
      return businessesService.getBusinessMember(request).then((member) => {
        expect(member.businessId).to.equal(businessId, 'businessId');
        expect(member.userId).to.equal(userId, 'userId');
        expect(member.owner).to.equal(expectedOwnerValue, 'owner');
      });
    });

    it(`And valid business verification code when verifying business member,
      Then return business that user is now verified for`, () => {

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      const someValidVerificationCode = 'c92131e8-9d38-41c7-a80d-cbd7352b3f77';
      // tslint:disable-next-line
      mockedAxiosAdapter.onGet(`${Environment.STAGING}/${Version.V1}${Resource.BUSINESS_MEMBER_VERIFICATIONS}/${someValidVerificationCode}`)
        .reply((data) => {
          expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
          return Promise.resolve([200, expectedBusiness]);
        });

      return businessesService.verifyBusinessMember(someValidVerificationCode).then((business) => {
        expectBusiness(business);
      });
    });

    function expectBusiness(actualBusiness: Business) {
      expect(actualBusiness.id).to.equal(expectedBusiness.id);
      expect(actualBusiness.alphabeticCurrencyCode).to.equal(expectedBusiness.alphabeticCurrencyCode);
      expect(actualBusiness.inventoryItemKey).to.equal(expectedBusiness.inventoryItemKey);
      expect(actualBusiness.name).to.equal(expectedBusiness.name);
      expect(actualBusiness.timeZone).to.equal(expectedBusiness.timeZone);
    }

    function expectChannelApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
