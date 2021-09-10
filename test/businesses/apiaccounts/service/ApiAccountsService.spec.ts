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

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'Api Account could not be found for business.'
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

    function expectApiAccount(actualApiAccount: ApiAccount) {
      expect(actualApiAccount.id).to.equal(expectedApiAccount.id);
      expect(actualApiAccount.businessId).to.equal(expectedApiAccount.businessId);
    }

    function expectChannelApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
