import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import SuppliersService from './../../../src/suppliers/service/SuppliersService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import Supplier from '../../../src/suppliers/model/Supplier';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import { ChannelApeError } from '../../../src/index';

describe('Suppliers Service', () => {

  describe('Given some rest client', () => {
    const client: RequestClientWrapper =
      new RequestClientWrapper({
        endpoint: Environment.STAGING,
        maximumRequestRetryTimeout: 10000,
        timeout: 60000,
        session: 'valid-session-id',
        logLevel: LogLevel.INFO,
        minimumRequestRetryRandomDelay: 50,
        maximumRequestRetryRandomDelay: 50
      });

    let sandbox: sinon.SinonSandbox;

    const expectedSupplier: Supplier = {
      businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
      id: '9c728601-0286-457d-b0d6-ec19292d4485',
      enabled: true,
      integrationId: '02df0b31-a071-4791-b9c2-aa01e4fb0ce6',
      name: 'Custom Column Export',
      createdAt: new Date('2018-02-22T16:04:29.030Z'),
      updatedAt: new Date('2018-04-02T13:04:27.299Z')
    };

    const expectedSupplier2: Supplier = {
      businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
      createdAt: new Date('2018-07-23T11:40:03.862Z'),
      enabled: true,
      id: 'ca7cdcb7-99eb-467b-b9b6-baf47078503e',
      integrationId: 'a140518f-2385-4b68-8015-28b5c3de778d',
      name: 'humdingers-business-of-the-americas',
      updatedAt: new Date('2018-07-26T11:47:06.246Z')
    };

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'Supplier could not be found for business.'
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

    it('And valid supplier ID ' +
      'When retrieving supplier Then return resolved promise with supplier', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedSupplier);

      const suppliersService: SuppliersService = new SuppliersService(client);
      return suppliersService.get(expectedSupplier.id).then((actualAction) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SUPPLIERS}/${expectedSupplier.id}`);
        expectSupplier(expectedSupplier);
      });
    });

    it('And valid business ID ' +
      'When retrieving suppliers Then return resolved promise with suppliers', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, { errors: [], suppliers: [expectedSupplier, expectedSupplier2] });

      const suppliersService: SuppliersService = new SuppliersService(client);
      return suppliersService.get({
        businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4'
      }).then((actualSuppliersResponse) => {
        expect(clientGetStub.args[0][0])
          .to.equal(`/${Version.V1}${Resource.SUPPLIERS}`);
        expect(clientGetStub.args[0][1].params.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
        expectSupplier(actualSuppliersResponse[0]);
      });
    });

    it('And valid supplier ID And request connect errors ' +
      'When retrieving supplier Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const suppliersService: SuppliersService = new SuppliersService(client);
      return suppliersService.get(expectedSupplier.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SUPPLIERS}/${expectedSupplier.id}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And valid business ID And request connect errors ' +
      'When retrieving suppliers Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const suppliersService: SuppliersService = new SuppliersService(client);
      return suppliersService.get({
        businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4'
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SUPPLIERS}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid supplier ID ' +
      'When retrieving supplier Then return a rejected promise with 404 status code ' +
      'And supplier not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const suppliersService: SuppliersService = new SuppliersService(client);
      return suppliersService.get(expectedSupplier.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SUPPLIERS}/${expectedSupplier.id}`);
        expectSupplierApeErrorResponse(e);
      });
    });

    it('And invalid business ID ' +
      'When retrieving suppliers Then return a rejected promise with 404 status code ' +
      'And an error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const suppliersService: SuppliersService = new SuppliersService(client);
      return suppliersService.get({
        businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4'
      }).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SUPPLIERS}`);
        expectSupplierApeErrorResponse(e);
      });
    });

    function expectSupplier(actualSupplier: Supplier) {
      expect(actualSupplier.id).to.equal(expectedSupplier.id);
      expect(actualSupplier.businessId).to.equal(expectedSupplier.businessId);
      expect(actualSupplier.integrationId).to.equal(expectedSupplier.integrationId);
      expect(actualSupplier.name).to.equal(expectedSupplier.name);
      expect(actualSupplier.enabled).to.equal(expectedSupplier.enabled);
      expect(actualSupplier.createdAt.toISOString()).to.equal(expectedSupplier.createdAt.toISOString());
      expect(actualSupplier.updatedAt.toISOString()).to.equal(expectedSupplier.updatedAt.toISOString());
    }

    function expectSupplierApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(404);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
