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
import LocationClosureRequest from './../../../src/locations/model/LocationClosureRequest';
import { LocationSLAUpdateRequest } from '../../../src';

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

    const expectedLocationSLAUpdate = {
      createdAt: new Date('2018-04-24T14:02:34.703Z'),
      fulfillmentSLAHours: '1',
      locationId: 'location-id',
      operatingDays: [
        {
          createdAt: new Date('2018-04-24T14:02:34.703Z'),
          day: 'T',
          end: '10:00',
          fulfillmentCutoffTime: '09:30',
          id: '23',
          open: '08:00',
          updatedAt: new Date('2018-04-24T14:02:34.703Z')
        },
        {
          createdAt: new Date('2018-04-24T14:02:34.703Z'),
          day: 'W',
          end: '10:00',
          fulfillmentCutoffTime: '09:50',
          id: '24',
          open: '08:00',
          updatedAt: new Date('2018-04-24T14:02:34.703Z')
        }
      ],
      updatedAt: new Date('2018-04-24T14:02:34.703Z')
    };
    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });
    const closesDates: LocationClosureRequest = {
      closedDays: [
        '2021/02/01',
        '2021/03/01',
        '2021/04/01',
        '2021/05/01',
        '2021/06/01'
      ]
    };

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
        name: 'some-location name',
        aggregateLocationIds: []
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
        name: 'some-location name',
        aggregateLocationIds: []
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
        name: 'some-location name',
        aggregateLocationIds: []
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
        name: 'some-location name',
        aggregateLocationIds: []
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
        name: 'some-location name',
        aggregateLocationIds: []
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
        name: 'some-location name',
        aggregateLocationIds: []
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

    it('And valid location id ' +
      'When retrieving sla information then return resolved promise with sla information', async () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedSLA = {
        createdAt: new Date('2021-06-11T07:48:05.000Z'),
        fulfillmentSLAHours: '1',
        locationId: '48',
        operatingDays: [
          {
            createdAt: new Date('2021-10-01T15:08:34.000Z'),
            day: 'T',
            end: '10:00',
            fulfillmentCutoffTime: '09:00',
            id: '23',
            open: '08:00',
            updatedAt: new Date('2021-10-01T15:09:56.000Z')
          },
          {
            createdAt: new Date('2021-10-01T15:08:34.000Z'),
            day: 'W',
            end: '10:00',
            fulfillmentCutoffTime: '09:00',
            id: '24',
            open: '08:00',
            updatedAt: new Date('2021-10-01T15:09:56.000Z')
          }
        ],
        updatedAt: new Date('2021-10-01T15:09:56.000Z')
      };

      const slaResponse = {
        createdAt: '2021-06-11T07:48:05.000Z',
        errors: [],
        fulfillmentSLAHours: '1',
        locationId: '48',
        operatingDays: [
          {
            createdAt: '2021-10-01T15:08:34.000Z',
            day: 'T',
            end: '10:00',
            fulfillmentCutoffTime: '09:00',
            id: '23',
            open: '08:00',
            updatedAt: '2021-10-01T15:09:56.000Z'
          },
          {
            createdAt: '2021-10-01T15:08:34.000Z',
            day: 'W',
            end: '10:00',
            fulfillmentCutoffTime: '09:00',
            id: '24',
            open: '08:00',
            updatedAt: '2021-10-01T15:09:56.000Z'
          }
        ],
        updatedAt: '2021-10-01T15:09:56.000Z'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, slaResponse);

      const locationsService: LocationsService = new LocationsService(client);
      const actualSLAResponse = await locationsService.getSla(expectedSLA.locationId);
      expect(clientGetStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.LOCATIONS}/${expectedSLA.locationId}/sla`);

      expect(actualSLAResponse.locationId).to.equal(expectedSLA.locationId);
      expect(actualSLAResponse.fulfillmentSLAHours).to.equal(expectedSLA.fulfillmentSLAHours);
      expect(actualSLAResponse.createdAt).deep.equal(expectedSLA.createdAt);
      expect(actualSLAResponse.updatedAt).deep.equal(expectedSLA.updatedAt);
      expect(actualSLAResponse.operatingDays.length).to.equal(2);

      expect(actualSLAResponse.operatingDays[0].day).to.equal(expectedSLA.operatingDays[0].day);
      expect(actualSLAResponse.operatingDays[0].end).to.equal(expectedSLA.operatingDays[0].end);
      expect(actualSLAResponse.operatingDays[0].fulfillmentCutoffTime).to
        .equal(expectedSLA.operatingDays[0].fulfillmentCutoffTime);
      expect(actualSLAResponse.operatingDays[0].id).to.equal(expectedSLA.operatingDays[0].id);
      expect(actualSLAResponse.operatingDays[0].open).to.equal(expectedSLA.operatingDays[0].open);
      expect(actualSLAResponse.operatingDays[0].createdAt).deep.equal(expectedSLA.operatingDays[0].createdAt);
      expect(actualSLAResponse.operatingDays[0].updatedAt).deep.equal(expectedSLA.operatingDays[0].updatedAt);

      expect(actualSLAResponse.operatingDays[1].day).to.equal(expectedSLA.operatingDays[1].day);
      expect(actualSLAResponse.operatingDays[1].end).to.equal(expectedSLA.operatingDays[1].end);
      expect(actualSLAResponse.operatingDays[1].fulfillmentCutoffTime).to
        .equal(expectedSLA.operatingDays[1].fulfillmentCutoffTime);
      expect(actualSLAResponse.operatingDays[1].id).to.equal(expectedSLA.operatingDays[1].id);
      expect(actualSLAResponse.operatingDays[1].open).to.equal(expectedSLA.operatingDays[1].open);
      expect(actualSLAResponse.operatingDays[1].createdAt).deep.equal(expectedSLA.operatingDays[1].createdAt);
      expect(actualSLAResponse.operatingDays[1].updatedAt).deep.equal(expectedSLA.operatingDays[1].updatedAt);

    });
    it('And valid location SLA information update request ' +
    'When update location SLA information then update location SLA information and ' +
    'return resolved promise with location SLA information', async () => {

      const response = {
        status: 200,
        config: {
          method: 'PUT'
        }
      };
      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
        .yields(null, response, expectedLocationSLAUpdate);

      const locationsService: LocationsService = new LocationsService(client);
      const actualSLAResponse = await locationsService.updateSla('location-id', expectedLocationSLAUpdate);
      expect(clientPutStub.args[0][0]).to
      .equal(`/${Version.V1}${Resource.LOCATIONS}/${expectedLocationSLAUpdate.locationId}/sla`);
      expect(actualSLAResponse.fulfillmentSLAHours).to.equal(expectedLocationSLAUpdate.fulfillmentSLAHours);
      expect(actualSLAResponse.operatingDays[0].day).to.equal(expectedLocationSLAUpdate.operatingDays[0].day);
      expect(actualSLAResponse.operatingDays[0].end).to.equal(expectedLocationSLAUpdate.operatingDays[0].end);
      expect(actualSLAResponse.operatingDays[0].fulfillmentCutoffTime).to
        .equal(expectedLocationSLAUpdate.operatingDays[0].fulfillmentCutoffTime);
      expect(actualSLAResponse.operatingDays[0].id).to.equal(expectedLocationSLAUpdate.operatingDays[0].id);
      expect(actualSLAResponse.operatingDays[0].open).to.equal(expectedLocationSLAUpdate.operatingDays[0].open);
      expect(actualSLAResponse.operatingDays[0].createdAt).to
        .equal(expectedLocationSLAUpdate.operatingDays[0].createdAt);
      expect(actualSLAResponse.operatingDays[0].updatedAt).to
        .equal(expectedLocationSLAUpdate.operatingDays[0].updatedAt);

    });
    it('And exception is thrown ' +
    'When updating location SLA then return rejected promise with errors', async () => {

      const expectedError = {
        stack: expectedChannelApeErrorResponse
      };
      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
        .yields(expectedError, null, null);

      const locationsService: LocationsService = new LocationsService(client);

      const locationSLAUpdateRequest: LocationSLAUpdateRequest = {
        fulfillmentSLAHours: '1',
        operatingDays: [
          {
            day: 'T',
            end: '10:00',
            fulfillmentCutoffTime: '09:30',
            open: '08:00'
          },
          {
            day: 'W',
            end: '10:00',
            fulfillmentCutoffTime: '09:50',
            open: '08:00'
          }
        ]
      };

      try {
        await locationsService.updateSla('location-id', locationSLAUpdateRequest);
        fail('Successfully ran location update but should have failed');
      } catch (error) {
        const actualRequestUrl = clientPutStub.args[0][0];
        const expectedRequestUrl = `/${Version.V1}${Resource.LOCATIONS}/${expectedLocationSLAUpdate.locationId}/sla`;
        const actualRequestBody = clientPutStub.args[0][1].data;
        expect(actualRequestUrl).to.equal(expectedRequestUrl);
        expect(actualRequestBody).to.equal(locationSLAUpdateRequest);
        expect(error.stack.statusCode).to.equal(404);
        expect(error.stack.errors[0].code).to.equal(70);
        expect(error).to.equal(expectedError);
      }
    });
    it('And valid location id ' +
      'When retrieving closure information then return resolved promise with closures', async () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedClosures = [
        {
          createdAt: '2021-10-01T15:08:34.000Z',
          id: '23',
          date: '2021-11-11',
          updatedAt: '2021-10-01T15:09:56.000Z'
        },
        {
          createdAt: '2021-10-01T15:08:34.000Z',
          id: '24',
          date: '2021-11-12',
          updatedAt: '2021-10-01T15:09:56.000Z'
        }
      ];

      const closuresResponse = {
        closedDays: expectedClosures,
        errors: [],
        locationId: '48'
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, closuresResponse);

      const locationsService: LocationsService = new LocationsService(client);
      const actualClosuresResponse = await locationsService.getClosures(closuresResponse.locationId);
      expect(clientGetStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.LOCATIONS}/${closuresResponse.locationId}/closures`);

      expect(actualClosuresResponse.length).to.equal(2);

      expect(actualClosuresResponse[0].createdAt).to.equal(expectedClosures[0].createdAt);
      expect(actualClosuresResponse[0].updatedAt).to.equal(expectedClosures[0].updatedAt);
      expect(actualClosuresResponse[0].id).to.equal(expectedClosures[0].id);
      expect(actualClosuresResponse[0].date).to.equal(expectedClosures[0].date);

      expect(actualClosuresResponse[1].createdAt).to.equal(expectedClosures[1].createdAt);
      expect(actualClosuresResponse[1].updatedAt).to.equal(expectedClosures[1].updatedAt);
      expect(actualClosuresResponse[1].id).to.equal(expectedClosures[1].id);
      expect(actualClosuresResponse[1].date).to.equal(expectedClosures[1].date);

    });
    it('And valid location update closed dates request ' +
    'When update location closed dates then update location closed dates and ' +
    'return resolved promise with location closed dates', async () => {

      const response = {
        status: 200,
        config: {
          method: 'PUT'
        }
      };

      const expectedLocationClosures = {
        closedDays: [
          {
            createdAt: '2021-12-30T09:27:38.000Z',
            date: '2021/04/01',
            id: '12',
            updatedAt: '2021-12-30T10:05:28.787Z'
          },
          {
            createdAt: '2021-12-30T09:27:38.000Z',
            date: '2021/05/01',
            id: '10',
            updatedAt: '2021-12-30T10:05:28.787Z'
          },
          {
            createdAt: '2021-12-30T10:05:28.787Z',
            date: '2021/02/01',
            id: '16',
            updatedAt: '2021-12-30T10:05:28.787Z'
          },
          {
            createdAt: '2021-12-30T09:27:38.000Z',
            date: '2021/03/01',
            id: '11',
            updatedAt: '2021-12-30T10:05:28.787Z'
          },
          {
            createdAt: '2021-12-30T09:27:38.000Z',
            date: '2021/06/01',
            id: '13',
            updatedAt: '2021-12-30T10:05:28.787Z'
          }
        ],
        errors: [],
        locationId: 'location-id'
      };

      const locationId = 'location-id';
      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedLocationClosures);

      const locationsService: LocationsService = new LocationsService(client);
      const actualLocationResponse = await locationsService.updateClosures(locationId, closesDates);
      expect(clientPutStub.args[0][0]).to
      .equal(`/${Version.V1}${Resource.LOCATIONS}/${locationId}/closures`);
      expect(actualLocationResponse[0].createdAt).
       to.equal(expectedLocationClosures.closedDays[0]['createdAt']);
      expect(actualLocationResponse[0].id).
       to.equal(expectedLocationClosures.closedDays[0]['id']);
      expect(actualLocationResponse[0].date).
       to.equal(expectedLocationClosures.closedDays[0]['date']);
      expect(actualLocationResponse[0].updatedAt).
       to.equal(expectedLocationClosures.closedDays[0]['updatedAt']);

    });
    it('And invalid location update closed dates request ' +
      'When updating location closed dates then return rejected promise with errors', async () => {

      const response = {
        status: 400,
        config: {
          method: 'PUT'
        }
      };

      const locationId = 'location-id';
      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
        .yields(null, response, expectedChannelApeErrorResponse);

      const locationsService: LocationsService = new LocationsService(client);

      try {
        await locationsService.updateClosures(locationId, closesDates);
        fail('Successfully ran location update closed but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.LOCATIONS}/${locationId}/closures`);
        expect(clientPutStub.args[0][1].data).to.equal(closesDates);
        expect(error.Response.statusCode).to.equal(400);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
              .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });
    it('And not found location id' +
    'When updating location closed dates then return rejected promise with errors', async () => {

      const response = {
        status: 404,
        config: {
          method: 'PUT'
        }
      };

      const locationId = 'invalid-location-id';

      const clientPutStub: sinon.SinonStub = sandbox.stub(client, 'put')
          .yields(null, response, expectedChannelApeErrorResponse);

      const locationsService: LocationsService = new LocationsService(client);

      try {
        await locationsService.updateClosures(locationId, closesDates);
        fail('Successfully ran location update closed using location id but should have failed');
      } catch (error) {
        expect(clientPutStub.args[0][0]).to
        .equal(`/${Version.V1}${Resource.LOCATIONS}/${locationId}/closures`);
        expect(clientPutStub.args[0][1].data).to.equal(closesDates);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
              .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      }
    });
  });
});
