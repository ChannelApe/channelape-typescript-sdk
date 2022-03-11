import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import Schedule from '../../../src/schedules/model/Schedule';
import SchedulesService from '../../../src/schedules/service/SchedulesService';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
describe('Schedules Service', () => {

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
    const businessId = '64d70831-c365-4238-b3d8-6077bebca788';
    const expectedAllSchedule: any = {
      errors: [],
      schedules: [
        {
          businessId: '64d70831-c365-4238-b3d8-6077bebca788',
          daysOfWeek: [
            'WEDNESDAY',
            'MONDAY',
            'THURSDAY',
            'SUNDAY',
            'FRIDAY',
            'TUESDAY',
            'SATURDAY'
          ],
          endTimeInMinutes: 1439,
          id: '6f0c1636-f61f-41b7-a0ee-b5303071f006',
          intervalInMinutes: 240,
          startTimeInMinutes: 1,
        }
      ]
    };
    const expectedSchedule: Schedule = {
      businessId: '64d70831-c365-4238-b3d8-6077bebca788',
      daysOfWeek: [
        'WEDNESDAY',
        'MONDAY',
        'THURSDAY',
        'SUNDAY',
        'FRIDAY',
        'TUESDAY',
        'SATURDAY'
      ],
      endTimeInMinutes: 1439,
      id: '6f0c1636-f61f-41b7-a0ee-b5303071f006',
      intervalInMinutes: 240,
      startTimeInMinutes: 1
    };
    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 100,
          message: 'Schedule could not be found.'
        }
      ]
    };
    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });
    it('And retrieve a Schedule' +
    ' When retrieving Schedule Then return resolved promise with a Schedules', () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
      .yields(null, response, expectedSchedule);
      const scheduleId = '6f0c1636-f61f-41b7-a0ee-b5303071f006';

      const scheduleservice: SchedulesService = new SchedulesService(client);
      return scheduleservice.get(scheduleId).then((actualSchedule: Schedule) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SCHEDULES}/${scheduleId}`);
        expect(actualSchedule['businessId']).to.equal(expectedSchedule['businessId']);
        expect(actualSchedule['endTimeInMinutes']).to.equal(expectedSchedule['endTimeInMinutes']);
        expect(actualSchedule['intervalInMinutes']).
        to.equal(expectedSchedule['intervalInMinutes']);
        expect(actualSchedule['startTimeInMinutes'])
        .to.equal(expectedSchedule['startTimeInMinutes']);
        expect(actualSchedule['daysOfWeek']).to.equal(expectedSchedule['daysOfWeek']);
      });
    });
    it('And invalid Scheduled ID ' +
    'When retrieving Schedule Then return a rejected promise with 404 status code ' +
    'And Schedule not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const scheduleservice: SchedulesService = new SchedulesService(client);
      return scheduleservice.get('invalid-schedule-id').then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((error) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SCHEDULES}/${'invalid-schedule-id'}`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      });
    });
    it('And retrieve a list of all Schedules' +
    ' When retrieving Schedule Then return resolved promise with all Schedules', () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
      .yields(null, response, expectedAllSchedule);

      const scheduleservice: SchedulesService = new SchedulesService(client);
      return scheduleservice.getAll(businessId).then((actualSchedule: Schedule[]) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SCHEDULES}?businessId=${businessId}`);
        expect(actualSchedule[0]['businessId']).to.equal(expectedAllSchedule.schedules[0]['businessId']);
        expect(actualSchedule[0]['endTimeInMinutes']).to.equal(expectedAllSchedule.schedules[0]['endTimeInMinutes']);
        expect(actualSchedule[0]['intervalInMinutes']).
        to.equal(expectedAllSchedule.schedules[0]['intervalInMinutes']);
        expect(actualSchedule[0]['startTimeInMinutes'])
        .to.equal(expectedAllSchedule.schedules[0]['startTimeInMinutes']);
        expect(actualSchedule[0]['daysOfWeek']).to.equal(expectedAllSchedule.schedules[0]['daysOfWeek']);
      });
    });
    it('And invalid Business ID ' +
    'When retrieving Schedule Then return a rejected promise with 404 status code ' +
    'And Schedule not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const scheduleservice: SchedulesService = new SchedulesService(client);
      return scheduleservice.getAll('invalid-business-id').then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((error) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.SCHEDULES}?businessId=invalid-business-id`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      });
    });
  });
});
