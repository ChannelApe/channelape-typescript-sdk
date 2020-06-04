import { expect } from 'chai';
import * as sinon from 'sinon';
import InventoriesService from '../../../../src/inventories/service/InventoriesService';
import LocationsService from '../../../../src/locations/service/LocationsService';
import Location from '../../../../src/locations/model/Location';
import { InventoryBatchAdjustmentsService } from '../../../../src/inventories/quantities/InventoryBatchAdjustmentsService';
import InventoryItemQuantitiesService from '../../../../src/inventories/quantities/InventoryItemQuantitiesService';
import BatchAdjustmentRequest from '../../../../src/inventories/quantities/model/BatchAdjustmentRequest';
import { InventoryStatus } from '../../../../src/inventories/enum/InventoryStatus';
import { fail } from 'assert';
import AdjustmentsBySku from '../../../../src/inventories/quantities/model/AdjustmentsBySku';

describe('Inventory Quantities Service', () => {

  describe('Given some rest client', () => {
    const sandbox = sinon.createSandbox();
    const location = {
      id: 'location-1',
      name: 'Location A',
      businessId: 'business-id-1',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Location;

    const inventoryItemQuantitiesServiceStub =
      sandbox.createStubInstance<InventoryItemQuantitiesService>(InventoryItemQuantitiesService);
    const inventoriesServiceStub = sandbox.createStubInstance<InventoriesService>(InventoriesService);
    const locationsServiceStub = sandbox.createStubInstance<LocationsService>(LocationsService);

    beforeEach((done) => {
      locationsServiceStub.get.resolves(location);
      inventoriesServiceStub.create.resolves();
      inventoryItemQuantitiesServiceStub.set.callsFake((request) => {
        return {
          locationId: request.locationId,
          quantity: request.quantity,
          inventoryItemId: request.inventoryItemId,
          inventoryStatus: request.inventoryStatus
        };
      });
      inventoryItemQuantitiesServiceStub.adjust.callsFake((request) => {
        return {
          locationId: request.locationId,
          quantity: request.quantity,
          inventoryItemId: request.inventoryItemId,
          inventoryStatus: request.inventoryStatus
        };
      });
      done();
    });

    afterEach((done) => {
      sandbox.resetHistory();
      done();
    });

    it('And batchAdjustmentRequest When making a single adjustment for a single sku ' +
      'which does not exist Then create an inventory item and make an adjustment', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }]
      }];
      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);
      const createdInventoryItem = {
        sku: batchAdjustmentRequest.adjustmentsBySku[0].sku,
        id: '1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inventoriesServiceStub.get.resolves([]);
      inventoriesServiceStub.create.resolves(createdInventoryItem);

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );
      await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);
      const expectedStatus = adjustmentsBySku[0].adjustments[0].inventoryStatus;
      expect(inventoriesServiceStub.get.calledOnce).to.equal(true);
      expect(inventoriesServiceStub.get.firstCall.args[0]).to.equal(location.businessId);
      expect(inventoriesServiceStub.get.firstCall.args[1]).to.equal(adjustmentsBySku[0].sku);
      expect(inventoriesServiceStub.create.calledOnce).to.equal(true);
      expect(inventoriesServiceStub.create.firstCall.args[0]).to.deep.equal({
        sku: adjustmentsBySku[0].sku,
        businessId: location.businessId
      });
      expect(inventoryItemQuantitiesServiceStub.set.calledOnce).to.equal(true);
      expect(inventoryItemQuantitiesServiceStub.set.firstCall.args[0]).to.deep.equal({
        locationId: location.id,
        quantity: adjustmentsBySku[0].adjustments[0].quantity,
        inventoryItemId: createdInventoryItem.id,
        inventoryStatus: expectedStatus,
        idempotentKey: buildKey(deduplicationKey, location.id, createdInventoryItem.id, expectedStatus)
      });
    });

    it('And batchAdjustmentRequest When making multiple adjustments for a single sku ' +
      'which does not exist Then create multiple inventory items and make multiple adjustments', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 2
        }, {
          inventoryStatus: InventoryStatus.ON_HAND,
          quantity: 1
        }]
      }];
      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);
      const createdInventoryItem = {
        sku: batchAdjustmentRequest.adjustmentsBySku[0].sku,
        id: '1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inventoriesServiceStub.get.resolves([]);
      inventoriesServiceStub.create.resolves(createdInventoryItem);

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );
      await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);
      expect(inventoriesServiceStub.get.calledOnce).to.equal(true);
      expect(inventoriesServiceStub.get.firstCall.args[0]).to.equal(location.businessId);
      expect(inventoriesServiceStub.get.firstCall.args[1]).to.equal(adjustmentsBySku[0].sku);
      expect(inventoriesServiceStub.create.calledOnce).to.equal(true);
      expect(inventoriesServiceStub.create.firstCall.args[0]).to.deep.equal({
        sku: adjustmentsBySku[0].sku,
        businessId: location.businessId
      });
      expect(inventoryItemQuantitiesServiceStub.set.callCount).to.equal(3);
      for (const adjustment of adjustmentsBySku[0].adjustments) {
        const foundAdjustment = findSetInventoryItem(createdInventoryItem.id, adjustment.inventoryStatus);
        if (!foundAdjustment) {
          fail('Could not find adjustment');
        }
        const expectedKey = buildKey(
          deduplicationKey, location.id, createdInventoryItem.id, adjustment.inventoryStatus);
        expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
        expect(foundAdjustment.locationId).to.equal(location.id);
        expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
      }
    });

    it('And batchAdjustmentRequest When making a multiple adjustments for a single sku ' +
      'which already exists Then get the inventory item and make multiple adjustments', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 2
        }, {
          inventoryStatus: InventoryStatus.ON_HAND,
          quantity: 1
        }]
      }];
      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);
      const existingInventoryItem = {
        id: '1',
        sku: batchAdjustmentRequest.adjustmentsBySku[0].sku,
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inventoriesServiceStub.get.resolves([existingInventoryItem]);

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );

      await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);

      expect(inventoriesServiceStub.create.called).to.equal(false);
      expect(inventoriesServiceStub.get.calledOnce).to.equal(true);
      expect(inventoriesServiceStub.get.firstCall.args[0]).to.equal(location.businessId);
      expect(inventoriesServiceStub.get.firstCall.args[1]).to.equal(adjustmentsBySku[0].sku);
      expect(inventoryItemQuantitiesServiceStub.set.callCount).to.equal(3);
      for (const adjustment of adjustmentsBySku[0].adjustments) {
        const foundAdjustment = findSetInventoryItem(existingInventoryItem.id, adjustment.inventoryStatus);
        if (!foundAdjustment) {
          fail('Could not find adjustment');
        }
        const expectedKey = buildKey(
          deduplicationKey, location.id, existingInventoryItem.id, adjustment.inventoryStatus);
        expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
        expect(foundAdjustment.locationId).to.equal(location.id);
        expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
      }
    });

    it('And batchAdjustmentRequest When making a multiple adjustments for multiple skus ' +
      'which do not exist Then create multiple inventory items and make multiple adjustments', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 1
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 2
        }]
      }, {
        sku: 'B1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 4
        }]
      }, {
        sku: 'C1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 5
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 6
        }]
      }];
      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);

      inventoriesServiceStub.create.callsFake((options: any) => {
        const foundIndex = adjustmentsBySku.findIndex(adjustment => adjustment.sku === options.sku);
        return {
          sku: options.sku,
          id: foundIndex.toString(),
          businessId: options.businessId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );

      inventoriesServiceStub.get.resolves([]);

      await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);

      expect(inventoriesServiceStub.get.callCount).to.equal(3);
      for (const [index, adjustment] of adjustmentsBySku.entries()) {
        expect(inventoriesServiceStub.get.args[index][0]).to.equal(location.businessId);
        expect(inventoriesServiceStub.get.args[index][1]).to.equal(adjustment.sku);
      }

      expect(inventoriesServiceStub.create.callCount).to.equal(3);
      for (const newInventoryItem of inventoriesServiceStub.create.args) {
        const found = adjustmentsBySku.find(adjustment => adjustment.sku === newInventoryItem[0].sku);
        expect(found).to.not.equal(undefined);
        expect(newInventoryItem[0].businessId).to.equal(location.businessId);
      }

      expect(inventoryItemQuantitiesServiceStub.set.callCount).to.equal(6);

      for (const [index, adjustmentBySku] of adjustmentsBySku.entries()) {
        for (const adjustment of adjustmentBySku.adjustments) {
          const foundAdjustment = findSetInventoryItem(index.toString(), adjustment.inventoryStatus);
          if (!foundAdjustment) {
            fail('Could not find adjustment');
          }
          const expectedKey = buildKey(deduplicationKey, location.id, index.toString(), adjustment.inventoryStatus);
          expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
          expect(foundAdjustment.locationId).to.equal(location.id);
          expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
        }
      }
    });

    it('And batchAdjustmentRequest When making a multiple adjustments for multiple skus ' +
      'which all but one exist Then create a single inventory item and get multiple inventory ' +
      'items and make multiple adjustments', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 1
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 2
        }]
      }, {
        sku: 'B1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 4
        }]
      }, {
        sku: 'C1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 5
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 6
        }]
      }];
      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);

      inventoriesServiceStub.create.callsFake((options: any) => {
        const foundIndex = adjustmentsBySku.findIndex(adjustment => adjustment.sku === options.sku);
        return {
          sku: options.sku,
          id: foundIndex.toString(),
          businessId: options.businessId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );

      const existingInventoryItem = [{
        id: '0',
        sku: 'A1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: '2',
        sku: 'C1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      inventoriesServiceStub.get.callsFake((businessId: string, sku: string) => {
        const found = existingInventoryItem.find(item => item.sku === sku);
        if (found) {
          return [found];
        }
        return [];
      });

      await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);

      expect(inventoriesServiceStub.get.callCount).to.equal(3);
      for (const [index, adjustment] of adjustmentsBySku.entries()) {
        expect(inventoriesServiceStub.get.args[index][0]).to.equal(location.businessId);
        expect(inventoriesServiceStub.get.args[index][1]).to.equal(adjustment.sku);
      }

      expect(inventoriesServiceStub.create.callCount).to.equal(1);
      for (const newInventoryItem of inventoriesServiceStub.create.args) {
        const found = adjustmentsBySku.find(adjustment => adjustment.sku === newInventoryItem[0].sku);
        expect(found).to.not.equal(undefined);
        expect(newInventoryItem[0].businessId).to.equal(location.businessId);
      }

      expect(inventoryItemQuantitiesServiceStub.set.callCount).to.equal(6);

      for (const [index, adjustmentBySku] of adjustmentsBySku.entries()) {
        for (const adjustment of adjustmentBySku.adjustments) {
          const foundAdjustment = findSetInventoryItem(index.toString(), adjustment.inventoryStatus);
          if (!foundAdjustment) {
            fail('Could not find adjustment');
          }
          const expectedKey = buildKey(deduplicationKey, location.id, index.toString(), adjustment.inventoryStatus);
          expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
          expect(foundAdjustment.locationId).to.equal(location.id);
          expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
        }
      }
    });

    it('And batchAdjustmentRequest When making a single adjustments for multiple existing skus ' +
      'and one inventory item fails to be retrieved Then get multiple inventory items and make multiple adjustments ' +
      'and throw an error', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 1
        }]
      }, {
        sku: 'B1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }]
      }, {
        sku: 'C1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 5
        }]
      }];

      const existingInventoryItem = [{
        id: '0',
        sku: 'A1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: '2',
        sku: 'C1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );

      inventoriesServiceStub.get.callsFake((businessId: string, sku: string) => {
        const found = existingInventoryItem.find(item => item.sku === sku);
        if (found) {
          return [found];
        }
        throw new Error('some error message');
      });

      try {
        await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);
        fail('Expected to fail');
      } catch (error) {
        expect(error.message).to.equal('At least one adjustment failed');
      }

      expect(inventoriesServiceStub.get.callCount).to.equal(3);
      for (const [index, adjustment] of adjustmentsBySku.entries()) {
        expect(inventoriesServiceStub.get.args[index][0]).to.equal(location.businessId);
        expect(inventoriesServiceStub.get.args[index][1]).to.equal(adjustment.sku);
      }

      expect(inventoryItemQuantitiesServiceStub.set.callCount).to.equal(2);

      for (const [index, adjustmentBySku] of adjustmentsBySku.entries()) {
        for (const adjustment of adjustmentBySku.adjustments) {
          const foundAdjustment = findSetInventoryItem(index.toString(), adjustment.inventoryStatus);
          if (adjustmentBySku.sku === 'B1') {
            expect(foundAdjustment).to.equal(undefined);
            continue;
          }
          if (!foundAdjustment) {
            fail('Could not find adjustment');
          }
          const expectedKey = buildKey(deduplicationKey, location.id, index.toString(), adjustment.inventoryStatus);
          expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
          expect(foundAdjustment.locationId).to.equal(location.id);
          expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
        }
      }
    });

    it('And batchAdjustmentRequest When setting adjustments for multiple existing skus ' +
    'and one adjustment fails Then get multiple inventory items and make multiple adjustments ' +
    'and throw an error', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 1
        }]
      }, {
        sku: 'B1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }, {
          inventoryStatus: InventoryStatus.ON_HAND,
          quantity: 4
        }]
      }, {
        sku: 'C1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 5
        }]
      }];

      const existingInventoryItem = [{
        id: '0',
        sku: 'A1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: '1',
        sku: 'B1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: '2',
        sku: 'C1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );

      inventoriesServiceStub.get.callsFake((businessId: string, sku: string) => {
        const found = existingInventoryItem.find(item => item.sku === sku);
        return [found];
      });

      inventoryItemQuantitiesServiceStub.set.callsFake((request) => {
        if (request.inventoryItemId === '1' && request.inventoryStatus === 'AVAILABLE_TO_SELL') {
          throw new Error('Failed to make adjustment');
        }
        return {
          locationId: request.locationId,
          quantity: request.quantity,
          inventoryItemId: request.inventoryItemId,
          inventoryStatus: request.inventoryStatus
        };
      });

      try {
        await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);
        fail('Expected to fail');
      } catch (error) {
        expect(error.message).to.equal('At least one adjustment failed');
      }

      expect(inventoriesServiceStub.get.callCount).to.equal(3);
      for (const [index, adjustment] of adjustmentsBySku.entries()) {
        expect(inventoriesServiceStub.get.args[index][0]).to.equal(location.businessId);
        expect(inventoriesServiceStub.get.args[index][1]).to.equal(adjustment.sku);
      }

      expect(inventoryItemQuantitiesServiceStub.set.callCount).to.equal(4);

      for (const [index, adjustmentBySku] of adjustmentsBySku.entries()) {
        for (const adjustment of adjustmentBySku.adjustments) {
          const foundAdjustment = findSetInventoryItem(index.toString(), adjustment.inventoryStatus);
          if (!foundAdjustment) {
            fail('Could not find adjustment');
          }
          const expectedKey = buildKey(deduplicationKey, location.id, index.toString(), adjustment.inventoryStatus);
          expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
          expect(foundAdjustment.locationId).to.equal(location.id);
          expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
        }
      }
    });

    it('And batchAdjustmentRequest When setting adjustments for multiple existing skus ' +
    'and one adjustment fails Then get multiple inventory items and make multiple adjustments ' +
    'and throw an error', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 1
        }]
      }, {
        sku: 'B1',
        adjustments: [{
          status: 'XY',
          quantity: 3
        }]
      }, {
        sku: 'C1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 5
        }]
      }] as AdjustmentsBySku[];

      const existingInventoryItem = [{
        id: '0',
        sku: 'A1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: '1',
        sku: 'B1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: '2',
        sku: 'C1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );

      inventoriesServiceStub.get.callsFake((businessId: string, sku: string) => {
        const found = existingInventoryItem.find(item => item.sku === sku);
        return [found];
      });

      try {
        await inventoryQuantitiesService.setBatch(batchAdjustmentRequest);
        fail('Expected to fail');
      } catch (error) {
        expect(error.message).to.equal('At least one adjustment failed');
      }

      expect(inventoriesServiceStub.get.callCount).to.equal(3);
      for (const [index, adjustment] of adjustmentsBySku.entries()) {
        expect(inventoriesServiceStub.get.args[index][0]).to.equal(location.businessId);
        expect(inventoriesServiceStub.get.args[index][1]).to.equal(adjustment.sku);
      }

      expect(inventoryItemQuantitiesServiceStub.set.callCount).to.equal(2);

      for (const [index, adjustmentBySku] of adjustmentsBySku.entries()) {
        for (const adjustment of adjustmentBySku.adjustments) {
          const foundAdjustment = findSetInventoryItem(index.toString(), adjustment.inventoryStatus);
          if (adjustmentBySku.sku === 'B1') {
            expect(foundAdjustment).to.equal(undefined);
            continue;
          }
          if (!foundAdjustment) {
            fail('Could not find adjustment');
          }
          const expectedKey = buildKey(deduplicationKey, location.id, index.toString(), adjustment.inventoryStatus);
          expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
          expect(foundAdjustment.locationId).to.equal(location.id);
          expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
        }
      }
    });

    it('And batchAdjustmentRequest When setting multiple adjustments for a single sku ' +
      'which does not exist Then create multiple inventory items and make multiple adjustments', async () => {
      const deduplicationKey = '05052020';
      const adjustmentsBySku = [{
        sku: 'A1',
        adjustments: [{
          inventoryStatus: InventoryStatus.AVAILABLE_TO_SELL,
          quantity: 3
        }, {
          inventoryStatus: InventoryStatus.COMMITTED,
          quantity: 2
        }, {
          inventoryStatus: InventoryStatus.ON_HAND,
          quantity: 1
        }]
      }];
      const batchAdjustmentRequest = new BatchAdjustmentRequest(location.id, deduplicationKey, adjustmentsBySku);
      const createdInventoryItem = {
        sku: batchAdjustmentRequest.adjustmentsBySku[0].sku,
        id: '1',
        businessId: location.businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inventoriesServiceStub.get.resolves([]);
      inventoriesServiceStub.create.resolves(createdInventoryItem);

      const inventoryQuantitiesService = new InventoryBatchAdjustmentsService(
        // @ts-ignore
        inventoryItemQuantitiesServiceStub,
        inventoriesServiceStub,
        locationsServiceStub
      );
      await inventoryQuantitiesService.adjustBatch(batchAdjustmentRequest);
      expect(inventoriesServiceStub.get.calledOnce).to.equal(true);
      expect(inventoriesServiceStub.get.firstCall.args[0]).to.equal(location.businessId);
      expect(inventoriesServiceStub.get.firstCall.args[1]).to.equal(adjustmentsBySku[0].sku);
      expect(inventoriesServiceStub.create.calledOnce).to.equal(true);
      expect(inventoriesServiceStub.create.firstCall.args[0]).to.deep.equal({
        sku: adjustmentsBySku[0].sku,
        businessId: location.businessId
      });
      expect(inventoryItemQuantitiesServiceStub.adjust.callCount).to.equal(3);
      for (const adjustment of adjustmentsBySku[0].adjustments) {
        const foundAdjustment = findAdjustInventoryItem(createdInventoryItem.id, adjustment.inventoryStatus);
        if (!foundAdjustment) {
          fail('Could not find adjustment');
        }
        const expectedKey = buildKey(
          deduplicationKey, location.id, createdInventoryItem.id, adjustment.inventoryStatus);
        expect(foundAdjustment.quantity).to.equal(adjustment.quantity);
        expect(foundAdjustment.locationId).to.equal(location.id);
        expect(foundAdjustment.idempotentKey).to.equal(expectedKey);
      }
    });

    function findSetInventoryItem(inventoryId: string, status: string) {
      const found = inventoryItemQuantitiesServiceStub.set.args.find((args) => {
        return args[0].inventoryStatus === status &&
          args[0].inventoryItemId === inventoryId;
      });
      return found ? found[0] : undefined;
    }

    function findAdjustInventoryItem(inventoryId: string, status: string) {
      const found = inventoryItemQuantitiesServiceStub.adjust.args.find((args) => {
        return args[0].inventoryStatus === status &&
          args[0].inventoryItemId === inventoryId;
      });
      return found ? found[0] : undefined;
    }

    function buildKey(deduplicationKey: string, locationId: string, inventoryItemId: string, status: string): string {
      return `${deduplicationKey}_${locationId}_${inventoryItemId}_${status}`;
    }
  });

});
