import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../../src/model/LogLevel';
import Version from '../../../../src/model/Version';
import Resource from '../../../../src/model/Resource';
import Environment from '../../../../src/model/Environment';
import RequestClientWrapper from '../../../../src/RequestClientWrapper';
import ChannelApeApiErrorResponse from '../../../../src/model/ChannelApeApiErrorResponse';
import AdjustmentRequest from './../../../../src/inventories/quantities/model/AdjustmentRequest';
import InventoryQuantitiesService from './../../../../src/inventories/quantities/InventoryQuantitiesService';
import SubResource from './../../../../src/model/SubResource';
import { fail } from 'assert';

describe('Inventory Quantities Service', () => {

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

    it('And valid inventory adjustment request when adjusting inventory then adjust inventory', () => {

      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };

      const adjustmentRequest: AdjustmentRequest = {
        quantity: 31,
        locationId: '99',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        effectiveAt: new Date('2019-11-22T17:02:49.009Z'),
      };
      const expectedAdjustment = {
        adjustment: 31,
        createdAt: '2019-11-22T17:02:49.009Z',
        effectiveAt: '2019-11-22T17:02:49.009Z',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        locationId: '28',
        quantity: 63,
        updatedAt: '2019-11-22T17:02:49.009Z'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedAdjustment);

      const inventoryQuantitiesService: InventoryQuantitiesService = new InventoryQuantitiesService(client);
      return inventoryQuantitiesService.adjust(adjustmentRequest).then((actualAdjustment: any) => {
        // tslint:disable-next-line:max-line-length
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/${expectedAdjustment.inventoryItemId}/${SubResource.QUANTITIES}/${SubResource.ADJUSTS}`);
        expect(clientPostStub.args[0][1].data).to.equal(adjustmentRequest);
        expect(actualAdjustment.inventoryItemId).to.equal(expectedAdjustment.inventoryItemId);
        expect(actualAdjustment.adjustment).to.equal(expectedAdjustment.adjustment);
        expect(actualAdjustment.inventoryStatus).to.equal(expectedAdjustment.inventoryStatus);
        expect(actualAdjustment.createdAt).to.equal(expectedAdjustment.createdAt);
        expect(actualAdjustment.updatedAt).to.equal(expectedAdjustment.updatedAt);
        expect(actualAdjustment.effectiveAt).to.equal(expectedAdjustment.effectiveAt);
        expect(actualAdjustment.locationId).to.equal(expectedAdjustment.locationId);
        expect(actualAdjustment.quantity).to.equal(expectedAdjustment.quantity);
      });

    });

    it('And invalid inventory adjustment request when adjusting inventory then expect errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'POST'
        }
      };

      const adjustmentRequest: AdjustmentRequest = {
        quantity: 31,
        locationId: '99',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        effectiveAt: new Date('2019-11-22T17:02:49.009Z'),
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedChannelApeErrorResponse);

      const inventoryQuantitiesService: InventoryQuantitiesService = new InventoryQuantitiesService(client);
      try {
        const actualAdjustment = await inventoryQuantitiesService.adjust(adjustmentRequest);
        fail('Expected inventory quantity adjustment to fail but it didn\'t.');
      } catch (e) {
        // tslint:disable-next-line:max-line-length
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/${adjustmentRequest.inventoryItemId}/${SubResource.QUANTITIES}/${SubResource.ADJUSTS}`);
        expect(clientPostStub.args[0][1].data).to.equal(adjustmentRequest);
        expect(e.Response.statusCode).to.equal(404);
        expect(e.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(e.ApiErrors[0].message)
            .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And inventory adjustment request and exception when adjusting inventory then expect errors', async () => {

      const error = {
        stack: 'some-error'
      };

      const adjustmentRequest: AdjustmentRequest = {
        quantity: 31,
        locationId: '99',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        effectiveAt: new Date('2019-11-22T17:02:49.009Z'),
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(error, null, null);

      const inventoryQuantitiesService: InventoryQuantitiesService = new InventoryQuantitiesService(client);
      try {
        const actualAdjustment = await inventoryQuantitiesService.adjust(adjustmentRequest);
        fail('Expected inventory quantity adjustment to fail but it didn\'t.');
      } catch (e) {
        // tslint:disable-next-line:max-line-length
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/${adjustmentRequest.inventoryItemId}/${SubResource.QUANTITIES}/${SubResource.ADJUSTS}`);
        expect(clientPostStub.args[0][1].data).to.equal(adjustmentRequest);
        expect(e).to.equal(error);
      }
    });

    it('And valid inventory adjustment request when setting inventory then set inventory', () => {
      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };

      const adjustmentRequest: AdjustmentRequest = {
        quantity: 31,
        locationId: '99',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        effectiveAt: new Date('2019-11-22T17:02:49.009Z'),
      };
      const expectedAdjustment = {
        adjustment: 31,
        createdAt: '2019-11-22T17:02:49.009Z',
        effectiveAt: '2019-11-22T17:02:49.009Z',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        locationId: '28',
        quantity: 63,
        updatedAt: '2019-11-22T17:02:49.009Z'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedAdjustment);

      const inventoryQuantitiesService: InventoryQuantitiesService = new InventoryQuantitiesService(client);
      return inventoryQuantitiesService.set(adjustmentRequest).then((actualAdjustment: any) => {
        // tslint:disable-next-line:max-line-length
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/${expectedAdjustment.inventoryItemId}/${SubResource.QUANTITIES}/${SubResource.SETS}`);
        expect(clientPostStub.args[0][1].data).to.equal(adjustmentRequest);
        expect(actualAdjustment.inventoryItemId).to.equal(expectedAdjustment.inventoryItemId);
        expect(actualAdjustment.adjustment).to.equal(expectedAdjustment.adjustment);
        expect(actualAdjustment.inventoryStatus).to.equal(expectedAdjustment.inventoryStatus);
        expect(actualAdjustment.createdAt).to.equal(expectedAdjustment.createdAt);
        expect(actualAdjustment.updatedAt).to.equal(expectedAdjustment.updatedAt);
        expect(actualAdjustment.effectiveAt).to.equal(expectedAdjustment.effectiveAt);
        expect(actualAdjustment.locationId).to.equal(expectedAdjustment.locationId);
        expect(actualAdjustment.quantity).to.equal(expectedAdjustment.quantity);
      });
    });

    it('And invalid inventory adjustment request when setting inventory then expect errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'POST'
        }
      };

      const adjustmentRequest: AdjustmentRequest = {
        quantity: 31,
        locationId: '99',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        effectiveAt: new Date('2019-11-22T17:02:49.009Z'),
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedChannelApeErrorResponse);

      const inventoryQuantitiesService: InventoryQuantitiesService = new InventoryQuantitiesService(client);
      try {
        const actualAdjustment = await inventoryQuantitiesService.set(adjustmentRequest);
        fail('Expected inventory quantity adjustment to fail but it didn\'t.');
      } catch (e) {
        // tslint:disable-next-line:max-line-length
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/${adjustmentRequest.inventoryItemId}/${SubResource.QUANTITIES}/${SubResource.SETS}`);
        expect(clientPostStub.args[0][1].data).to.equal(adjustmentRequest);
        expect(e.Response.statusCode).to.equal(404);
        expect(e.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(e.ApiErrors[0].message)
            .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And inventory adjustment request and exception when adjusting inventory then expect errors', async () => {

      const error = {
        stack: 'some-error'
      };

      const adjustmentRequest: AdjustmentRequest = {
        quantity: 31,
        locationId: '99',
        inventoryItemId: '35',
        inventoryStatus: 'ON_HOLD',
        effectiveAt: new Date('2019-11-22T17:02:49.009Z'),
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(error, null, null);

      const inventoryQuantitiesService: InventoryQuantitiesService = new InventoryQuantitiesService(client);
      try {
        const actualAdjustment = await inventoryQuantitiesService.set(adjustmentRequest);
        fail('Expected inventory quantity adjustment to fail but it didn\'t.');
      } catch (e) {
        // tslint:disable-next-line:max-line-length
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/${adjustmentRequest.inventoryItemId}/${SubResource.QUANTITIES}/${SubResource.SETS}`);
        expect(clientPostStub.args[0][1].data).to.equal(adjustmentRequest);
        expect(e).to.equal(error);
      }
    });

  });
});
