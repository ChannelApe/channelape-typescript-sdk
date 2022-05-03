import { expect } from 'chai';
import * as sinon from 'sinon';
import InventoriesService from '../../../../src/inventories/service/InventoriesService';
import LocationsService from '../../../../src/locations/service/LocationsService';
import Location from '../../../../src/locations/model/Location';
import { BatchCreationService } from '../../../../src/inventories/batches/BatchCreationService';
import { InventoryStatus } from '../../../../src/inventories/enum/InventoryStatus';
import { fail } from 'assert';

describe('Batches Creation Service', () => {

  describe('Given some rest client', () => {
    const sandbox = sinon.createSandbox();
    const location = {
      id: 'location-1',
      name: 'Location A',
      businessId: 'business-id-1',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Location;

    const batchCreationServiceStub =
      sandbox.createStubInstance<BatchCreationService>(BatchCreationService);
    const locationsServiceStub = sandbox.createStubInstance<LocationsService>(LocationsService);

    beforeEach((done) => {
      locationsServiceStub.get.resolves(location);
      batchCreationServiceStub.set.callsFake((request) => {
        return {
          locationId: request.locationId,
          quantity: request.quantity,
          inventoryItemId: request.inventoryItemId,
          inventoryStatus: request.inventoryStatus
        };
      });
      batchCreationServiceStub.adjust.callsFake((request) => {
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

    it('And Adjustments When making various adjustments ' +
      'Then create a batch item and return it', async () => {

    });
  });

});
