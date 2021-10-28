import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import BusinessesService from './../../../src/businesses/service/BusinessesService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import Business, { BusinessMembers } from '../../../src/businesses/model/Business';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import {
  ChannelApeError,
  AlphabeticCurrencyCode,
  InventoryItemKey,
  TimeZoneId,
  InvitationResponse, RemoveMember
} from '../../../src/index';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';

import singleBusiness from '../resources/singleBusiness';
import BusinessCreateRequest from '../../../src/businesses/model/BusinessCreateRequest';
import { fail } from 'assert';
import { Users } from '../../../src/users/model/User';
import updateBusinessSettings from '../resources/updateBusinessSettings';

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
      });
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
    const expectedBusinessMember:Users = {
      analyticsEnabled: false,
      errors: [],
      id: 'valid-user-id',
      username: 'some@email.com',
      verified: true
    };
    const expectedBusinessMember2:Users = {
      analyticsEnabled: false,
      errors: [],
      id: 'some-user-id',
      username: 'some@email.com',
      verified: true
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
    const expectedForbiddenErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 403,
      errors: [
        {
          code: 17,
          message: 'Only a member of this business can perform this action.'
        }
      ]
    };
    const expectedBadRequestErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 400,
      errors: [
        {
          code: 22,
          message: 'Request cannot be completed with given query parameters.'
        }
      ]
    };
    const expectedInviteMemberErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 8,
          message: 'Could not find user for given username.'
        }
      ]
    };
    const expectedRemoveMemberErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 403,
      errors: [
        {
          code: 21,
          message: 'Requested business member cannot be found.'
        }
      ]
    };
    const expectedBusinessUpdateErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'No businesses could be found.'
        }
      ]
    };
    const expectedBusinessUpdateTimezoneErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 400,
      errors: [
        {
          code: 14,
          message: 'Provided time zone is invalid.'
        }
      ]
    };
    const expectedBusinessUpdateBusinessNameBlankErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 400,
      errors: [
        {
          code: 13,
          message: 'Business name cannot be blank.'
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
    it(`And valid all business ID and user ID when retrieving user's business access configuration for all user's,
      Then return user's business access configuration`, () => {
      const businessId = 'valid-business-id';
      const userId = 'valid-user-id';
      const request = {
        businessId,
        userId
      };
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, { errors: [], Users: [expectedBusinessMember, expectedBusinessMember2] });
      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.getBusinessMembers(request).then((actualBusinessesResponse) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/?businessId=${request.businessId}`);
        expectBusinessMembers(actualBusinessesResponse);
      });
    });
    it('And invalid business ID ' +
        'When retrieving all businesses Then return a rejected promise with 403 status code ' +
        'And an error message', () => {

      const response = {
        status: 403,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedForbiddenErrorResponse);
      const businessId = 'invalid-business-id';
      const userId = 'invalid-user-id';
      const request = {
        businessId,
        userId
      };
      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.getBusinessMembers(request).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/?businessId=${request.businessId}`);
        expectedForbiddenErrorsResponse(e);
      });
    });
    it('And when no params of business ID ' +
        'When retrieving all businesses Then return a rejected promise with 400 status code ' +
        'And an error message', () => {

      const response = {
        status: 400,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedBadRequestErrorResponse);
      const businessId = '';
      const userId = '';
      const request = {
        businessId,
        userId
      };
      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.getBusinessMembers(request).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/?businessId=`);
        expectedBadRequestErrorsResponse(e);
      });
    });
    it('And send the invitation for business member, Then return return a user ID', () => {
      const newInvitation: InvitationResponse = JSON.parse(JSON.stringify({
        businessId: 'valid-business-id',
        errors: [],
        userId: 'valid-user-id'
      }));
      const businessId = 'valid-business-id';
      const username = 'manthan.c@channelape.com';
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPost(`/${Version.V1}${Resource.BUSINESSES}/${businessId}/members`)
          .reply((data) => {
            expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
            return Promise.resolve([201, newInvitation]);
          });

      return businessesService.inviteMember(username, businessId).then((invitationMember) => {
        expect(invitationMember.businessId).equal('valid-business-id');
        expect(invitationMember.userId).equal('valid-user-id');
      });
    });
    it('And invalid business ID ' +
        'When send invitation, Then return a rejected promise with 403 status code ' +
        'And an error message', () => {

      const response = {
        status: 403,
        config: {
          method: 'POST'
        }
      };
      const clientGetStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedForbiddenErrorResponse);
      const businessId = 'invalid-business-id';
      const username = 'sample11.c@channelape.com';
      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.inviteMember(username, businessId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${businessId}/members`);
        expectedForbiddenErrorsResponse(e);
      });
    });
    it('And invalid email ID ' +
        'When send invitation, Then return a rejected promise with 404 status code ' +
        'And an error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'POST'
        }
      };
      const clientGetStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedInviteMemberErrorResponse);
      const businessId = 'valid-business-id';
      const username = 'sample11.c@channelape.com';
      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.inviteMember(username, businessId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${businessId}/members`);
        expectedInviteMemberErrorsResponse(e);
      });
    });

    it('And will remove the member from the business and return the removed user', () => {
      const removeInvitation: RemoveMember = JSON.parse(JSON.stringify({
        businessId: 'valid-business-id',
        errors: [],
        owner: false,
        userId: 'valid-user-id'
      }));
      const businessId = 'valid-business-id';
      const userId = 'valid-user-id';
      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onDelete(`/${Version.V1}${Resource.BUSINESSES}/${businessId}/members/${userId}`)
          .reply((data) => {
            expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
            return Promise.resolve([200, removeInvitation]);
          });

      return businessesService.removeMember(businessId, userId).then((removeMember) => {
        expect(removeMember.businessId).equal('valid-business-id');
        expect(removeMember.userId).equal('valid-user-id');
        expect(removeMember.owner).equal(false);
      });
    });
    it('And invalid user ID ' +
        'When remove the member from the business, Then return a rejected promise with 404 status code ' +
        'And an error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'DELETE'
        }
      };
      const clientGetStub = sandbox.stub(client, 'delete')
          .yields(null, response, expectedRemoveMemberErrorResponse);
      const businessId = 'valid-business-id';
      const userId = 'invalid-user-id';
      const businessService: BusinessesService = new BusinessesService(client);
      return businessService.removeMember(businessId, userId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(
            `/${Version.V1}${Resource.BUSINESSES}/${businessId}/members/${userId}`);
        expectedRemoveMemberErrorsResponse(e);
      });
    });
    it('And will update the provided business, Then return update a business settings', () => {
      const updateBusiness: BusinessCreateRequest = JSON.parse(JSON.stringify(updateBusinessSettings));

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      mockedAxiosAdapter.onPut(`${Environment.STAGING}/${Version.V1}${Resource.BUSINESSES}`)
          .reply((data) => {
            expect(data.headers['X-Channel-Ape-Authorization-Token']).to.equal('valid-session-id');
            return Promise.resolve([200, updateBusiness]);
          });

      return businessesService.update(updateBusiness).then((updatedBusiness) => {
        expect(updatedBusiness.id).to.equal('64d70831-c365-4238-b3d8-6077bebca788', 'business.id');
        expect(updatedBusiness.timeZone).to.equal(TimeZoneId.US_ALASKA, 'timezone');
        expect(updatedBusiness.name).to.equal('DEMO MK', 'name');
        expect(updatedBusiness.inventoryItemKey).to.equal(InventoryItemKey.SKU, 'inventoryItemKey');
        expect(updatedBusiness.alphabeticCurrencyCode)
            .to.equal(AlphabeticCurrencyCode.USD, 'alphabeticCurrencyCode');
      });
    });
    it('And invalid business setting update request ' +
        'When updating business setting then return rejected promise with errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'PUT'
        }
      };

      const updateSettingData: Business = {
        name: 'DEMO MK',
        inventoryItemKey: InventoryItemKey.SKU,
        timeZone: TimeZoneId.ACT,
        alphabeticCurrencyCode: AlphabeticCurrencyCode.USD,
        id: 'invalid-id',
        embeds: [],
        errors: []
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedChannelApeErrorResponse);

      const businessService: BusinessesService = new BusinessesService(client);

      try {
        await businessService.update(updateSettingData);
        fail('Successfully ran inventory update but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
            .equal(`${Version.V1}${Resource.BUSINESSES}`);
        expect(clientPutStub.args[0][1].data).to.equal(updateSettingData);

        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedBusinessUpdateErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
            .to.equal(expectedBusinessUpdateErrorResponse.errors[0].message);
      }
    });
    it('And invalid business setting update(timezone) request ' +
        'When updating business setting(timezone) then return rejected promise with errors', async () => {

      const response = {
        status: 400,
        config: {
          method: 'PUT'
        }
      };

      const updateSettingData: Business = {
        name: 'DEMO MK',
        inventoryItemKey: InventoryItemKey.SKU,
        timeZone: 'invalid-timezone' as TimeZoneId,
        alphabeticCurrencyCode: AlphabeticCurrencyCode.USD,
        id: '64d70831-c365-4238-b3d8-6077bebca788',
        embeds: [],
        errors: []
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedBusinessUpdateTimezoneErrorResponse);

      const businessService: BusinessesService = new BusinessesService(client);

      try {
        await businessService.update(updateSettingData);
        fail('Successfully ran inventory update but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
            .equal(`${Version.V1}${Resource.BUSINESSES}`);
        expect(clientPutStub.args[0][1].data).to.equal(updateSettingData);

        expect(error.Response.statusCode).to.equal(400);
        expect(error.ApiErrors[0].code).to.equal(expectedBusinessUpdateTimezoneErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
            .to.equal(expectedBusinessUpdateTimezoneErrorResponse.errors[0].message);
      }
    });
    it('And invalid business setting update when business name is blank request ' +
        'When business name is blankthen return rejected promise with errors', async () => {

      const response = {
        status: 400,
        config: {
          method: 'PUT'
        }
      };

      const updateSettingData: Business = {
        name: '',
        inventoryItemKey: InventoryItemKey.SKU,
        timeZone: TimeZoneId.ACT,
        alphabeticCurrencyCode: AlphabeticCurrencyCode.USD,
        id: '64d70831-c365-4238-b3d8-6077bebca788',
        embeds: [],
        errors: []
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedBusinessUpdateBusinessNameBlankErrorResponse);

      const businessService: BusinessesService = new BusinessesService(client);

      try {
        await businessService.update(updateSettingData);
        fail('Successfully ran inventory update but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
            .equal(`${Version.V1}${Resource.BUSINESSES}`);
        expect(clientPutStub.args[0][1].data).to.equal(updateSettingData);

        expect(error.Response.statusCode).to.equal(400);
        expect(error.ApiErrors[0].code).to.equal(expectedBusinessUpdateBusinessNameBlankErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
            .to.equal(expectedBusinessUpdateBusinessNameBlankErrorResponse.errors[0].message);
      }
    });

    it(`And valid business verification code when verifying business member,
      Then return business that user is now verified for`, () => {

      const mockedAxiosAdapter = new axiosMockAdapter(axios);
      const someValidVerificationCode = 'c92131e8-9d38-41c7-a80d-cbd7352b3f77';
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
    function  expectBusinessMembers(actualBusinessMembers:BusinessMembers) {
      expect(actualBusinessMembers.Users[0].id).to.equal(expectedBusinessMember.id);
      expect(actualBusinessMembers.Users[0].username).to.equal(expectedBusinessMember.username);
    }
    function expectedForbiddenErrorsResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(403);
      expect(error.ApiErrors[0].code).to.equal(expectedForbiddenErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
          .to.equal(expectedForbiddenErrorResponse.errors[0].message);
    }
    function expectedBadRequestErrorsResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(400);
      expect(error.ApiErrors[0].code).to.equal(expectedBadRequestErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
          .to.equal(expectedBadRequestErrorResponse.errors[0].message);
    }
    function expectedInviteMemberErrorsResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedInviteMemberErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
          .to.equal(expectedInviteMemberErrorResponse.errors[0].message);
    }
    function expectedRemoveMemberErrorsResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedRemoveMemberErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
          .to.equal(expectedRemoveMemberErrorResponse.errors[0].message);
    }
  });
});
