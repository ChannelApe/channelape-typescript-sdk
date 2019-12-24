import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import { fail } from 'assert';
import LocationsService from './../../../src/locations/service/LocationsService';
import LocationCreateRequest from './../../../src/locations/model/LocationCreateRequest';
import LocationUpdateRequest from './../../../src/locations/model/LocationUpdateRequest';

describe('Locations Service', () => {

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
          message: 'Location Could not be found'
        }
      ]
    };

    it('And valid location id' +
      'When getting location details then return resolved promise with location', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedLocation = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        name: 'some-location name',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedLocation);

      const locationsService: LocationsService = new LocationsService(client);
      return locationsService.get('28').then((actualLocation: any) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}/${expectedLocation.id}`);
        expect(actualLocation.id).to.equal(expectedLocation.id);
        expect(actualLocation.errors.length).to.equal(expectedLocation.errors.length);
        expect(actualLocation.name).to.equal(expectedLocation.name);
        expect(actualLocation.createdAt).to.equal(expectedLocation.createdAt);
        expect(actualLocation.updatedAt).to.equal(expectedLocation.updatedAt);
        expect(actualLocation.businessId).to.equal(expectedLocation.businessId);
      });
    });

    it('And not found location id' +
      'When searching locations then return reject promise with errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedChannelApeErrorResponse);

      const locationsService: LocationsService = new LocationsService(client);
      try {
        await locationsService.get('1');
        fail('Successfully ran locationl retrieval by id but should have failed');
      } catch (error) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}/1`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
            .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception is thrown' +
      'When searching locations then return reject promise with errors', async () => {

      const error = {
        stack: 'some-error'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(error, null, null);

      const locationsService: LocationsService = new LocationsService(client);
      try {
        await locationsService.get('1');
        fail('Successfully ran location retrieval by id but should have failed');
      } catch (e) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}/1`);
        expect(e).to.equal(error);
      }
    });

    it('And valid business id and sku ' +
      'When searching locations then return resolved promise with locations', async () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedLocation = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        name: 'some-location name',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const locationsResponse = {
        locations: [expectedLocation],
        errors: []
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, locationsResponse);

      const locationsService: LocationsService = new LocationsService(client);
      const actualLocationsResponse = await locationsService.getByBusinessId(expectedLocation.businessId);
      expect(clientGetStub.args[0][0]).to
      .equal(`/${Version.V1}${Resource.LOCATIONS}?businessId=${expectedLocation.businessId}`);
      expect(actualLocationsResponse.length).to.equal(1);

      expect(actualLocationsResponse[0].id).to.equal(expectedLocation.id);
      expect(actualLocationsResponse[0].name).to.equal(expectedLocation.name);
      expect(actualLocationsResponse[0].createdAt).to.equal(expectedLocation.createdAt);
      expect(actualLocationsResponse[0].updatedAt).to.equal(expectedLocation.updatedAt);
      expect(actualLocationsResponse[0].businessId).to.equal(expectedLocation.businessId);

    });

    it('And not found business id ' +
      'When searching locations then return reject promise with errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(null, response, expectedChannelApeErrorResponse);

      const locationsService: LocationsService = new LocationsService(client);
      try {
        await locationsService.get('ABC-123');
        fail('Successfully ran location retrieval by business but should have failed');
      } catch (error) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}/ABC-123`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
            .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception is thrown' +
      'When searching locations then return reject promise with errors', async () => {

      const expectedError = {
        stack: 'some-error'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
          .yields(expectedError, null, null);

      const locationsService: LocationsService = new LocationsService(client);
      try {
        await locationsService.get('ABC-123');
        fail('Successfully ran locations retrieval by business but should have failed');
      } catch (e) {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}/ABC-123`);
        expect(e).to.equal(expectedError);
      }
    });

    it('And valid location creation request ' +
      'When creating location then create location and ' +
      'return resolved promise with location', async () => {

      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };

      const expectedLocation = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        name: 'some-location name',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const locationCreationRequest: LocationCreateRequest = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        name: 'some-location name'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedLocation);

      const locationsService: LocationsService = new LocationsService(client);
      const locationResponse = await locationsService.create(locationCreationRequest);
      expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}`);
      expect(clientPostStub.args[0][1].data).to.equal(locationCreationRequest);

      expect(locationResponse.id).to.equal(expectedLocation.id);
      expect(locationResponse.name).to.equal(expectedLocation.name);
      expect(locationResponse.createdAt).to.equal(expectedLocation.createdAt);
      expect(locationResponse.updatedAt).to.equal(expectedLocation.updatedAt);
      expect(locationResponse.businessId).to.equal(expectedLocation.businessId);

    });

    it('And invalid location creation request ' +
      'When creating location then return rejected promise with errors', async () => {

      const response = {
        status: 400,
        config: {
          method: 'POST'
        }
      };

      const locationCreationRequest: LocationCreateRequest = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        name: 'some-location name'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(null, response, expectedChannelApeErrorResponse);

      const locationsService: LocationsService = new LocationsService(client);

      try {
        await locationsService.create(locationCreationRequest);
        fail('Successfully ran location creation but should have failed');
      } catch (error) {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}`);
        expect(clientPostStub.args[0][1].data).to.equal(locationCreationRequest);

        expect(error.Response.statusCode).to.equal(400);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
              .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception is thrown ' +
      'When creating location then return rejected promise with errors', async () => {

      const expectedError = {
        stack: 'some-error'
      };

      const locationCreationRequest: LocationCreateRequest = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        name: 'some-location name'
      };

      const clientPostStub: sinon.SinonStub = sandbox.stub(client, 'post')
          .yields(expectedError, null, null);

      const locationsService: LocationsService = new LocationsService(client);

      try {
        await locationsService.create(locationCreationRequest);
        fail('Successfully ran location creation but should have failed');
      } catch (error) {
        expect(clientPostStub.args[0][0]).to.equal(`/${Version.V1}${Resource.LOCATIONS}`);
        expect(clientPostStub.args[0][1].data).to.equal(locationCreationRequest);

        expect(error).to.equal(expectedError);
      }
    });

    it('And valid location update request ' +
      'When update location then update location and ' +
      'return resolved promise with location', async () => {

      const response = {
        status: 200,
        config: {
          method: 'PUT'
        }
      };

      const expectedLocation = {
        businessId: '3ad989ac-6d12-4498-b13a-9b61a2768e54',
        createdAt: '2019-11-15T13:38:04.000Z',
        errors: [],
        id: '28',
        name: 'some-location name',
        updatedAt: '2019-11-15T13:38:04.000Z'
      };

      const locationUpdateRequest: LocationUpdateRequest = {
        id: '33',
        name: 'some-location name'
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedLocation);

      const locationsService: LocationsService = new LocationsService(client);
      const actualLocationResponse = await locationsService.update(locationUpdateRequest);
      expect(clientPutStub.args[0][0]).to
      .equal(`/${Version.V1}${Resource.LOCATIONS}/${locationUpdateRequest.id}`);
      expect(clientPutStub.args[0][1].data).to.equal(locationUpdateRequest);

      expect(actualLocationResponse.id).to.equal(expectedLocation.id);
      expect(actualLocationResponse.name).to.equal(expectedLocation.name);
      expect(actualLocationResponse.createdAt).to.equal(expectedLocation.createdAt);
      expect(actualLocationResponse.updatedAt).to.equal(expectedLocation.updatedAt);
      expect(actualLocationResponse.businessId).to.equal(expectedLocation.businessId);

    });

    it('And invalid location update request ' +
      'When updating location then return rejected promise with errors', async () => {

      const response = {
        status: 400,
        config: {
          method: 'POST'
        }
      };

      const locationUpdateRequest: LocationUpdateRequest = {
        id: '33',
        name: 'some-location name'
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedChannelApeErrorResponse);

      const locationsService: LocationsService = new LocationsService(client);

      try {
        await locationsService.update(locationUpdateRequest);
        fail('Successfully ran location update but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.LOCATIONS}/${locationUpdateRequest.id}`);
        expect(clientPutStub.args[0][1].data).to.equal(locationUpdateRequest);

        expect(error.Response.statusCode).to.equal(400);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
              .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });

    it('And exception is thrown ' +
      'When updating location then return rejected promise with errors', async () => {

      const expectedError = {
        stack: 'some-error'
      };

      const locationUpdateRequest: LocationUpdateRequest = {
        id: '33',
        name: 'some-location name'
      };

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(expectedError, null, null);

      const locationsService: LocationsService = new LocationsService(client);

      try {
        await locationsService.update(locationUpdateRequest);
        fail('Successfully ran location update but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.LOCATIONS}/${locationUpdateRequest.id}`);
        expect(clientPutStub.args[0][1].data).to.equal(locationUpdateRequest);

        expect(error).to.equal(expectedError);
      }
    });
  });
});
