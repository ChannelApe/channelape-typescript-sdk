import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../../src/model/LogLevel';
import Version from '../../../../src/model/Version';
import Resource from '../../../../src/model/Resource';
import Environment from '../../../../src/model/Environment';
import RequestClientWrapper from '../../../../src/RequestClientWrapper';
import ChannelApeApiErrorResponse from '../../../../src/model/ChannelApeApiErrorResponse';
import AdjustmentRequest from '../../../../src/inventories/quantities/model/AdjustmentRequest';
import InventoryItemQuantitiesService from '../../../../src/inventories/quantities/InventoryItemQuantitiesService';
import SubResource from '../../../../src/model/SubResource';
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

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);
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

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);
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

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);
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

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);
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

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);
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

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);
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

    it('And valid inventory item id when retrieving inventory quantities then return inventory quantities', () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const expectedQuantity1 = {
        inventoryStatus: 'ON_HOLD',
        locationId: '28',
        quantity: 63
      };
      const expectedQuantity2 = {
        inventoryStatus: 'ON_HAND',
        locationId: '28',
        quantity: 63
      };

      const expectedQuantities = {
        errors: [],
        quantities: [expectedQuantity1, expectedQuantity2]
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedQuantities);

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);
      return inventoryQuantitiesService.retrieve('35').then((actualQuantities: any) => {
        expect(actualQuantities.length).to.equal(2);
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/35/${SubResource.QUANTITIES}`);
        expect(actualQuantities[0].inventoryStatus).to.equal(expectedQuantity1.inventoryStatus);
        expect(actualQuantities[0].locationId).to.equal(expectedQuantity1.locationId);
        expect(actualQuantities[0].quantity).to.equal(expectedQuantity1.quantity);

        expect(actualQuantities[1].inventoryStatus).to.equal(expectedQuantity2.inventoryStatus);
        expect(actualQuantities[1].locationId).to.equal(expectedQuantity2.locationId);
        expect(actualQuantities[1].quantity).to.equal(expectedQuantity2.quantity);
      });
    });

    it('And invalid inventory item id when retrieving inventory quantities then return errors', async () => {
      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);

      try {
        await inventoryQuantitiesService.retrieve('35');
        fail('expected inventory item quantity retrieval to fail but it did not');
      } catch (e) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/35/${SubResource.QUANTITIES}`);
        expect(e.Response.statusCode).to.equal(404);
        expect(e.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(e.ApiErrors[0].message)
            .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception occurs when retrieving inventory quantities then return errors', async () => {
      const error = {
        stack: ['Error occurred']
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(error, null, null);

      const inventoryQuantitiesService: InventoryItemQuantitiesService = new InventoryItemQuantitiesService(client);

      try {
        await inventoryQuantitiesService.retrieve('35');
        fail('expected inventory item quantity retrieval to fail but it did not');
      } catch (e) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.INVENTORIES}/35/${SubResource.QUANTITIES}`);
        expect(e).to.equal(error);

      }
    });

  });
});
