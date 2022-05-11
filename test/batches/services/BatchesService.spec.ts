import { LogLevel } from 'channelape-logger';
import sinon = require('sinon');
import { ChannelApeError, Environment, InventoryStatus } from '../../../src';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import { BatchAdjustmentCreationRequest } from '../../../src/batches/models/BatchAdjustmentCreationRequest';
import { BatchesService } from '../../../src/batches/services/BatchesService';

import { AdjustmentType } from '../../../src/inventories/enum/AdjustmentType';
import { expect } from 'chai';
import { BatchResponse } from '../../../src/batches/models/BatchResponse';
import { AxiosRequestConfig } from 'axios';
import { fail } from 'assert';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
describe('Batches Service', () => {
  const client: RequestClientWrapper = new RequestClientWrapper({
    endpoint: Environment.STAGING,
    maximumRequestRetryTimeout: 10000,
    timeout: 60000,
    session: 'valid-session-id',
    logLevel: LogLevel.INFO,
    minimumRequestRetryRandomDelay: 50,
    maximumRequestRetryRandomDelay: 50,
    maximumConcurrentConnections: 5,
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
  describe('When creating inventory adjustment batch', () => {
    it('Given some valid adjustment batch then expect correct values', async () => {
      const response = {
        status: 201,
        config: {
          method: 'POST',
        },
      };
      const batchResponse: BatchResponse = {
        id: '325bd7f2-272a-4212-9abb-59ffeaddb5ab',
        type: 'INVENTORY',
        status: 'READY',
        createdAt: new Date('2022-04-19T02:35:17.000Z'),
        updatedAt: new Date('2022-04-19T02:35:17.000Z'),
        businessId: '938a69a8-9ef2-4faa-b485-dad486aba56e',
      };
      const batchInventoryCreation: BatchAdjustmentCreationRequest = {
        businessId: '123',
        adjustments: [
          {
            idempotentKey: 'some-uuid-1',
            inventoryItemId: 123,
            operation: AdjustmentType.SET,
            memo: 'Memo',
            inventoryStatus: InventoryStatus.ON_ORDER,
            quantity: 10,
            locationId: '100',
          },
          {
            idempotentKey: 'some-uuid-1',
            sku: 'ABC',
            operation: AdjustmentType.ADJUST,
            memo: 'Memo',
            inventoryStatus: InventoryStatus.ON_ORDER,
            quantity: 10,
            locationId: '100',
          },
        ],
      };
      const clientPostStub: sinon.SinonStub = sandbox
        .stub(client, 'post')
        .yields(null, response, batchResponse);

      const batchesService: BatchesService = new BatchesService(client);
      const actualResponse = await batchesService.createInventoryQuantityBatch(
        batchInventoryCreation
      );
      expect(actualResponse).to.not.be.null;
      expect(actualResponse).to.deep.equal(batchResponse);

      const options: AxiosRequestConfig = {
        data: batchInventoryCreation,
      };
      expect(clientPostStub.args[0][0]).to.equal('/v1/batches');
      expect(clientPostStub.args[0][1]).to.deep.equal(options);
    });

    it('Given some invalid adjustment batch with validation errors then expect correct values', async () => {
      const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
        statusCode: 400,
        errors: [
          {
            code: 70,
            message: 'Idempotent Key must be unique per adjustment',
          },
        ],
      };
      const response = {
        status: 400,
        config: {
          method: 'POST',
        },
      };
      const batchInventoryCreation: BatchAdjustmentCreationRequest = {
        businessId: '123',
        adjustments: [
          {
            idempotentKey: 'some-uuid-1',
            inventoryItemId: 123,
            operation: AdjustmentType.SET,
            memo: 'Memo',
            inventoryStatus: InventoryStatus.ON_ORDER,
            quantity: 10,
            locationId: '100',
          },
          {
            idempotentKey: 'some-uuid-1',
            sku: 'ABC',
            operation: AdjustmentType.ADJUST,
            memo: 'Memo',
            inventoryStatus: InventoryStatus.ON_ORDER,
            quantity: 10,
            locationId: '100',
          },
        ],
      };
      const clientPostStub: sinon.SinonStub = sandbox
        .stub(client, 'post')
        .yields(null, response, expectedChannelApeErrorResponse);

      const batchesService: BatchesService = new BatchesService(client);
      try {
        await batchesService.createInventoryQuantityBatch(
          batchInventoryCreation
        );
        fail();
      } catch (e) {
        expect(e).to.not.be.null;
        const actualError = e as ChannelApeError;
        expect(actualError.ApiErrors.length).to.deep.equal(1);
        expect(actualError.ApiErrors[0].message).to.deep.equal(
          'Idempotent Key must be unique per adjustment'
        );
        expect(actualError.Response.statusCode).to.equal(400);
        expect(actualError.ApiErrors[0].code).to.deep.equal(70);

        const options: AxiosRequestConfig = {
          data: batchInventoryCreation,
        };
        expect(clientPostStub.args[0][0]).to.equal('/v1/batches');
        expect(clientPostStub.args[0][1]).to.deep.equal(options);
      }
    });

    it('Given some invalid adjustment batch and unexpected errors then expect correct values', async () => {
      const expectedError = {
        stack: 'oh no an error',
      };
      const clientPostStub: sinon.SinonStub = sandbox
        .stub(client, 'post')
        .yields(expectedError, null, null);
      const batchInventoryCreation: BatchAdjustmentCreationRequest = {
        businessId: '123',
        adjustments: [
          {
            idempotentKey: 'some-uuid-1',
            inventoryItemId: 123,
            operation: AdjustmentType.SET,
            memo: 'Memo',
            inventoryStatus: InventoryStatus.ON_ORDER,
            quantity: 10,
            locationId: '100',
          },
          {
            idempotentKey: 'some-uuid-1',
            sku: 'ABC',
            operation: AdjustmentType.ADJUST,
            memo: 'Memo',
            inventoryStatus: InventoryStatus.ON_ORDER,
            quantity: 10,
            locationId: '100',
          },
        ],
      };
      const batchesService: BatchesService = new BatchesService(client);
      try {
        await batchesService.createInventoryQuantityBatch(
          batchInventoryCreation
        );
        fail();
      } catch (e) {
        const options: AxiosRequestConfig = {
          data: batchInventoryCreation,
        };
        expect(e).to.equal(expectedError);
        expect(clientPostStub.args[0][0]).to.equal('/v1/batches');
        expect(clientPostStub.args[0][1]).to.deep.equal(options);
      }
    });
  });

  describe('When retrieving batch details', () => {
    it('Given some valid batch then expect correct values', async () => {
      const response = {
        status: 200,
        config: {
          method: 'GET',
        },
      };
      const batchResponse: BatchResponse = {
        id: '325bd7f2-272a-4212-9abb-59ffeaddb5ab',
        type: 'INVENTORY',
        status: 'READY',
        createdAt: new Date('2022-04-19T02:35:17.000Z'),
        updatedAt: new Date('2022-04-19T02:35:17.000Z'),
        businessId: '938a69a8-9ef2-4faa-b485-dad486aba56e',
      };
      const clientGetStub: sinon.SinonStub = sandbox
        .stub(client, 'get')
        .yields(null, response, batchResponse);

      const batchesService: BatchesService = new BatchesService(client);
      const actualResponse = await batchesService.get(
        '325bd7f2-272a-4212-9abb-59ffeaddb5ab'
      );
      expect(actualResponse).to.not.be.null;
      expect(actualResponse).to.deep.equal(batchResponse);

      expect(clientGetStub.args[0][0]).to.equal(
        '/v1/batches/325bd7f2-272a-4212-9abb-59ffeaddb5ab'
      );
      expect(clientGetStub.args[0][1]).to.deep.equal({});
    });

    it('Given some not found batch then expect correct values', async () => {
      const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
        statusCode: 404,
        errors: [
          {
            code: 70,
            message: 'Batch could not be found.',
          },
        ],
      };
      const response = {
        status: 404,
        config: {
          method: 'POST',
        },
      };
      const clientGetStub: sinon.SinonStub = sandbox
        .stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const batchesService: BatchesService = new BatchesService(client);
      try {
        await batchesService.get('325bd7f2-272a-4212-9abb-59ffeaddb5ab');
        fail();
      } catch (e) {
        expect(e).to.not.be.null;
        const actualError = e as ChannelApeError;
        expect(actualError.ApiErrors.length).to.deep.equal(1);
        expect(actualError.ApiErrors[0].message).to.deep.equal(
          'Batch could not be found.'
        );
        expect(actualError.Response.statusCode).to.equal(404);
        expect(actualError.ApiErrors[0].code).to.deep.equal(70);

        expect(clientGetStub.args[0][0]).to.equal(
          '/v1/batches/325bd7f2-272a-4212-9abb-59ffeaddb5ab'
        );
        expect(clientGetStub.args[0][1]).to.deep.equal({});
      }
    });

    it('Given some invalid adjustment batch and unexpected errors then expect correct values', async () => {
      const expectedError = {
        stack: 'oh no an error',
      };
      const clientGetStub: sinon.SinonStub = sandbox
        .stub(client, 'get')
        .yields(expectedError, null, null);

      const batchesService: BatchesService = new BatchesService(client);
      try {
        await batchesService.get('325bd7f2-272a-4212-9abb-59ffeaddb5ab');
        fail();
      } catch (e) {
        expect(e).to.equal(expectedError);
        expect(clientGetStub.args[0][0]).to.equal(
          '/v1/batches/325bd7f2-272a-4212-9abb-59ffeaddb5ab'
        );
        expect(clientGetStub.args[0][1]).to.deep.equal({});
      }
    });
  });
});
