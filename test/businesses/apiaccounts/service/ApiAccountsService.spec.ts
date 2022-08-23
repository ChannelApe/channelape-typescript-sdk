import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from './../../../../src/model/LogLevel';
import ApiAccountsService from './../../../../src/businesses/apiaccounts/service/ApiAccountsService';
import Version from './../../../../src/model/Version';
import Resource from './../../../../src/model/Resource';
import Environment from './../../../../src/model/Environment';
import ChannelApeApiErrorResponse from './../../../../src/model/ChannelApeApiErrorResponse';
import RequestClientWrapper from './../../../../src/RequestClientWrapper';
import { ChannelApeError } from './../../../../src/index';
import ApiAccount from './../../../../src/businesses/apiaccounts/model/ApiAccount';

describe('Api Accounts Service', () => {

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

    let sandbox: sinon.SinonSandbox;

    const expectedApiAccount: ApiAccount = {
      businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
      creationTime: new Date('2019-09-05T20:22:19.737Z'),
      errors: [],
      id: '14bc4780-f2c0-48d6-8e9a-41e6816c55eb',
      name: 'Update Orders Playbook Step',
      lastAccessedTime: new Date('2020-09-05T20:22:19.737Z'),
      expired: true
    };

    const expectedApiAccounts: ApiAccount [] = [
      {
        businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
        creationTime: new Date('2019-09-05T20:22:19.737Z'),
        errors: [],
        id: '14bc4780-f2c0-48d6-8e9a-41e6816c55eb',
        name: 'Update Orders Playbook Step',
        lastAccessedTime: new Date('2020-09-05T20:22:19.737Z'),
        expired: true
      },
      {
        businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
        creationTime: new Date('2020-06-04T14:45:59.746Z'),
        errors: [],
        id: '23d01b59-379b-4474-af05-33daf9d49bfa',
        name: 'Code-Dojo',
        lastAccessedTime: undefined,
        expired: true
      }
    ];
    const deleteAccountResponse =   {
      businessId: '64d70831-c365-4238-b3d8-6077bebca788',
      creationTime: '2021-10-27T19:19:10.372Z',
      errors: [],
      expired: true,
      id: 'dd0097e4-a571-428c-8155-3e931235d309',
      name: 'Demo2'
    };

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'Api Account could not be found for business.'
        }
      ]
    };
    const expectedDeleteAccountErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 207,
          message: 'Requested API Account with id not found for business.'
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

    it(`And valid API Account ID When retrieving API Account for business
    Then return resolved promise with API Account`, () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedApiAccount);
      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.get(expectedApiAccount.businessId, expectedApiAccount.id).then((actualAction) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${expectedApiAccount.businessId}${Resource.API_ACCOUNTS}/${expectedApiAccount.id}`);
        expectApiAccount(expectedApiAccount);
      });
    });

    it(`And valid API Account ID When retrieving API Account by id
    Then return resolved promise with API Account`, () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedApiAccount);
      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.getById(expectedApiAccount.id).then((apiAccountResponse: ApiAccount) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.API_ACCOUNTS}/${expectedApiAccount.id}`);
        expectApiAccount(apiAccountResponse);
      });
    });

    it(`And not found API Account ID When retrieving API
    Account ID for business Then return resolved promise with error`, () => {
      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.get(expectedApiAccount.businessId, expectedApiAccount.id).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${expectedApiAccount.businessId}${Resource.API_ACCOUNTS}/${expectedApiAccount.id}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it(`And unexpected error occurs
    When retrieving API Account ID for business Then return rejected promise with error`, () => {
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.get(expectedApiAccount.businessId, expectedApiAccount.id).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${expectedApiAccount.businessId}${Resource.API_ACCOUNTS}/${expectedApiAccount.id}`);
        expect(e).to.equal(expectedError);
      });
    });

    it(`And return a list of all of the API accounts for the business, if only the business ID
    Then return resolved promise with API Account for all accounts`, () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, { apiAccounts: expectedApiAccounts });
      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.get(businessId).then((actualAllAccounts : ApiAccount[] | ApiAccount) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}`);
        expectApiAccounts(actualAllAccounts);
      });
    });

    it(`And unexpected error occurs
    When retrieving API Accounts ID's for all business Then return rejected promise with error`, () => {
      const businessId = '4baafa5b-4fbf-404e-9766-8a02ad45c3a4';
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(expectedError, null, null);

      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.get(businessId).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}`);
        expect(e).to.equal(expectedError);
      });
    });

    it(`And delete the specified API account from the business,
    Then return resolved promise with deleted account`, () => {
      const response = {
        status: 200,
        config: {
          method: 'DELETE'
        }
      };
      const businessId = '64d70831-c365-4238-b3d8-6077bebca788';
      const apiAccountId = 'dd0097e4-a571-428c-8155-3e931235d309';
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'delete')
          .yields(null, response, deleteAccountResponse);
      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.delete(businessId, apiAccountId).then((deleteAccount) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}/${apiAccountId}`);
        expect(deleteAccount.id).to.equal(deleteAccountResponse.id);
        expect(deleteAccount.expired).to.equal(deleteAccountResponse.expired);
        expect(deleteAccount.businessId).to.equal(deleteAccountResponse.businessId);
      });
    });

    it(`And not found API Account ID When deleting API
    Account from business Then return resolved promise with error status 404`, () => {
      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const businessId = '64d70831-c365-4238-b3d8-6077bebca788';
      const apiAccountId = 'dd0097e4-a571-428c-8155-3e931235d3000';
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedDeleteAccountErrorResponse);

      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.get(businessId, apiAccountId).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}/${apiAccountId}`);
        expectDeleteAccountErrorResponse(e);
      });
    });

    it(`And creating a new API account
      Then return resolved promise with new API account`, () => {
      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };
      const businessId = '64d70831-c365-4238-b3d8-6077bebca788';
      const name = 'some-api-key';
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, {
          name,
          businessId: '9ad7a773-64d3-4efa-a916-3117e79f3c8f',
          creationTime: '2021-10-29T15:59:30.416Z',
          errors: [],
          expired: true,
          id: '23323c67-5240-415a-a0ce-1b534231f35b',
          lastAccessedTime: undefined
        });

      const apiAccountsService: ApiAccountsService = new ApiAccountsService(client);
      return apiAccountsService.create(name, businessId).then((response) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}`);
        expect((response as ApiAccount).name).to.equal(name);
      });
    });

    function expectApiAccount(actualApiAccount: ApiAccount) {
      expect(actualApiAccount.id).to.equal(expectedApiAccount.id);
      expect(actualApiAccount.businessId).to.equal(expectedApiAccount.businessId);
    }
    function expectApiAccounts(actualApiAccount: ApiAccount[] | ApiAccount) {
      if (Array.isArray(actualApiAccount)) {
        expect(actualApiAccount[0].id).to.equal(expectedApiAccount.id);
        expect(actualApiAccount[0].businessId).to.equal(expectedApiAccount.businessId);
      }
    }
    function expectChannelApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }
    function expectDeleteAccountErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedDeleteAccountErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
          .to.equal(expectedDeleteAccountErrorResponse.errors[0].message);
    }
  });
});
