import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import InventoriesService from './../../../src/inventories/service/InventoriesService';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import { fail } from 'assert';
import { InventoryItemCreateRequest } from './../../../src/inventories/model/InventoryItemCreateRequest';
import { InventoryItemUpdateRequest } from './../../../src/inventories/model/InventoryItemUpdateRequest';

describe('Inventories Service', () => {

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

    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'Inventory Item Could not be found'
        }
      ]
    };

    it('And valid inventory item id' +
      'When getting inventory item details then return resolved promise with inventory item', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedInventoryItem = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedInventoryItem);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      return inventoriesService.get('28').then((actualInventoryItem: any) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/${expectedInventoryItem.id}`);
        expect(actualInventoryItem.id).to.equal(expectedInventoryItem.id);
        expect(actualInventoryItem.errors.length).to.equal(expectedInventoryItem.errors.length);
        expect(actualInventoryItem.title).to.equal(expectedInventoryItem.title);
        expect(actualInventoryItem.sku).to.equal(expectedInventoryItem.sku);
        expect(actualInventoryItem.createdAt).to.equal(expectedInventoryItem.createdAt);
        expect(actualInventoryItem.updatedAt).to.equal(expectedInventoryItem.updatedAt);
        expect(actualInventoryItem.businessId).to.equal(expectedInventoryItem.businessId);
      });
    });

    it('And not found inventory item id' +
      'When searching inventory items then return reject promise with errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedChannelApeErrorResponse);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      try {
        await inventoriesService.get('1');
        fail('Successfully ran inventory retrieval by id but should have failed');
      } catch (error) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/1`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
            .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And inventory item id but ChannelApe API returns a 500' +
      'When searching inventory items then return reject promise with errors', async () => {

      const response = {
        status: 500,
        config: {
          method: 'GET'
        }
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(response, null, expectedChannelApeErrorResponse);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      try {
        await inventoriesService.get('1');
        fail('Successfully ran inventory retrieval by id but should have failed with 500');
      } catch (error) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/1`);
        expect(error.status).to.equal(500);
      }
    });

    it('And exception is thrown' +
      'When searching inventory items then return reject promise with errors', async () => {

      const error = {
        stack: 'some-error'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(error, null, null);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      try {
        await inventoriesService.get('1');
        fail('Successfully ran inventory retrieval by id but should have failed');
      } catch (e) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/1`);
        expect(e).to.equal(error);
      }
    });

    it('And valid business id and sku ' +
      'When searching inventory items then return resolved promise with inventory items', async () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedInventoryItem = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const inventoryItemResponse = {
        inventoryItems: [expectedInventoryItem],
        errors: []
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, inventoryItemResponse);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      const actualInventoryItemsResponse = await inventoriesService.get('1', 'ABC-123');
      expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}`);
      expect(actualInventoryItemsResponse.length).to.equal(1);

      expect(actualInventoryItemsResponse[0].id).to.equal(expectedInventoryItem.id);
      expect(actualInventoryItemsResponse[0].title).to.equal(expectedInventoryItem.title);
      expect(actualInventoryItemsResponse[0].sku).to.equal(expectedInventoryItem.sku);
      expect(actualInventoryItemsResponse[0].createdAt).to.equal(expectedInventoryItem.createdAt);
      expect(actualInventoryItemsResponse[0].updatedAt).to.equal(expectedInventoryItem.updatedAt);
      expect(actualInventoryItemsResponse[0].businessId).to.equal(expectedInventoryItem.businessId);

    });

    it('And not found business id and sku ' +
      'When searching inventory items then return reject promise with errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedChannelApeErrorResponse);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      try {
        await inventoriesService.get('1', 'ABC-123');
        fail('Successfully ran inventory retrieval by business and sku but should have failed');
      } catch (error) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
            .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception is thrown' +
      'When searching inventory items then return reject promise with errors', async () => {

      const expectedError = {
        stack: 'some-error'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(expectedError, null, null);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      try {
        await inventoriesService.get('1', 'ABC-123');
        fail('Successfully ran inventory retrieval by business and sku but should have failed');
      } catch (e) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}`);
        expect(e).to.equal(expectedError);
      }
    });

    it('And valid inventory item creation request ' +
      'When creating inventory item then create inventory item and ' +
      'return resolved promise with inventory items', async () => {

      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };

      const expectedCreatedInventoryItem = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const inventoryItemCreationRequest: InventoryItemCreateRequest = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedCreatedInventoryItem);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      const actualInventoryItemsResponse = await inventoriesService.create(inventoryItemCreationRequest);
      expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}`);
      expect(clientPostStub.args[0][1].data).to.equal(inventoryItemCreationRequest);

      expect(actualInventoryItemsResponse.id).to.equal(expectedCreatedInventoryItem.id);
      expect(actualInventoryItemsResponse.title).to.equal(expectedCreatedInventoryItem.title);
      expect(actualInventoryItemsResponse.sku).to.equal(expectedCreatedInventoryItem.sku);
      expect(actualInventoryItemsResponse.createdAt).to.equal(expectedCreatedInventoryItem.createdAt);
      expect(actualInventoryItemsResponse.updatedAt).to.equal(expectedCreatedInventoryItem.updatedAt);
      expect(actualInventoryItemsResponse.businessId).to.equal(expectedCreatedInventoryItem.businessId);

    });

    it('And invalid inventory item creation request ' +
      'When creating inventory item then return rejected promise with errors', async () => {

      const response = {
        status: 400,
        config: {
          method: 'POST'
        }
      };

      const inventoryItemCreationRequest: InventoryItemCreateRequest = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedChannelApeErrorResponse);

      const inventoriesService: InventoriesService = new InventoriesService(client);

      try {
        await inventoriesService.create(inventoryItemCreationRequest);
        fail('Successfully ran inventory creation but should have failed');
      } catch (error) {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}`);
        expect(clientPostStub.args[0][1].data).to.equal(inventoryItemCreationRequest);

        expect(error.Response.statusCode).to.equal(400);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
              .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception is thrown ' +
      'When creating inventory item then return rejected promise with errors', async () => {

      const expectedError = {
        stack: 'some-error'
      };

      const inventoryItemCreationRequest: InventoryItemCreateRequest = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(expectedError, null, null);

      const inventoriesService: InventoriesService = new InventoriesService(client);

      try {
        await inventoriesService.create(inventoryItemCreationRequest);
        fail('Successfully ran inventory creation but should have failed');
      } catch (error) {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}`);
        expect(clientPostStub.args[0][1].data).to.equal(inventoryItemCreationRequest);

        expect(error).to.equal(expectedError);
      }
    });

    it('And valid inventory item update request ' +
      'When update inventory item then update inventory item and ' +
      'return resolved promise with inventory items', async () => {

      const response = {
        status: 200,
        config: {
          method: 'PUT'
        }
      };

      const expectedCreatedInventoryItem = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const inventoryItemUpdateRequest: InventoryItemUpdateRequest = {
        id: '33',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see'
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedCreatedInventoryItem);

      const inventoriesService: InventoriesService = new InventoriesService(client);
      const actualInventoryItemResponse = await inventoriesService.update(inventoryItemUpdateRequest);
      expect(clientPutStub.args[0][0]).to
      .equal(`/${Version.V1}${Resource.INVENTORIES}/${inventoryItemUpdateRequest.id}`);
      expect(clientPutStub.args[0][1].data).to.equal(inventoryItemUpdateRequest);

      expect(actualInventoryItemResponse.id).to.equal(expectedCreatedInventoryItem.id);
      expect(actualInventoryItemResponse.title).to.equal(expectedCreatedInventoryItem.title);
      expect(actualInventoryItemResponse.sku).to.equal(expectedCreatedInventoryItem.sku);
      expect(actualInventoryItemResponse.createdAt).to.equal(expectedCreatedInventoryItem.createdAt);
      expect(actualInventoryItemResponse.updatedAt).to.equal(expectedCreatedInventoryItem.updatedAt);
      expect(actualInventoryItemResponse.businessId).to.equal(expectedCreatedInventoryItem.businessId);

    });

    it('And invalid inventory item update request ' +
      'When updating inventory item then return rejected promise with errors', async () => {

      const response = {
        status: 400,
        config: {
          method: 'POST'
        }
      };

      const inventoryItemUpdateRequest: InventoryItemUpdateRequest = {
        id: '33',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see'
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedChannelApeErrorResponse);

      const inventoriesService: InventoriesService = new InventoriesService(client);

      try {
        await inventoriesService.update(inventoryItemUpdateRequest);
        fail('Successfully ran inventory update but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.INVENTORIES}/${inventoryItemUpdateRequest.id}`);
        expect(clientPutStub.args[0][1].data).to.equal(inventoryItemUpdateRequest);

        expect(error.Response.statusCode).to.equal(400);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
              .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception is thrown ' +
      'When updating inventory item then return rejected promise with errors', async () => {

      const expectedError = {
        stack: 'some-error'
      };

      const inventoryItemUpdateRequest: InventoryItemUpdateRequest = {
        id: '33',
        sku: 'ABC-12999',
        title: 'The coolest pair of shoes youll ever see'
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(expectedError, null, null);

      const inventoriesService: InventoriesService = new InventoriesService(client);

      try {
        await inventoriesService.update(inventoryItemUpdateRequest);
        fail('Successfully ran inventory update but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.INVENTORIES}/${inventoryItemUpdateRequest.id}`);
        expect(clientPutStub.args[0][1].data).to.equal(inventoryItemUpdateRequest);

        expect(error).to.equal(expectedError);
      }
    });
  });
});
