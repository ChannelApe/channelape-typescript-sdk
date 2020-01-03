import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import { ChannelApeError } from '../../../src/index';
import Embed from './../../../src/analytics/model/Embed';
import AnalyticsService from './../../../src/analytics/service/AnalyticsService';
import Report from './../../../src/analytics/model/Report';
import { Token } from './../../../src/analytics/model/Token';
import axios from 'axios';

describe('Analytics Service', () => {

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
      }, axios);

    let sandbox: sinon.SinonSandbox;

    const expectedEmbed: Embed = {
      embedUrl: 'https://some-cool-embed-link/test',
      expiration: new Date('2018-02-22T16:04:29.030Z')
    };

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 400,
      errors: [
        {
          code: 226,
          message: 'Attribute: embedCode is invalid. Embed code is required.'
        }
      ]
    };

    const expectedReportList: Report[] = [
      {
        category: 'Businesses',
        embedCode: 'b337b5c4681b60d98f9daf2d',
        name: 'Business Overview'
      },
      {
        category: 'Actions',
        embedCode: 'a976261040db028030704761',
        name: 'Actions by Start Time'
      },
      {
        category: 'Orders',
        embedCode: '1718c5556cf85794ab682af7',
        name: 'Order Activities Dashboard'
      },
      {
        category: 'Orders',
        embedCode: '03b2d44e8ac5c3088045055d',
        name: 'Order Activities Dashboard Production'
      }
    ];

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

    it('And valid embedCode code ' +
      'When generating embed Then return resolved promise with embed', () => {

      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedEmbed);

      const analyticsService: AnalyticsService = new AnalyticsService(client);
      return analyticsService.generateEmbed('some-code', 'America/New_York').then((actualAction) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V2}${Resource.ANALYTICS}`);
        expectEmbed(expectedEmbed);
      });
    });

    it('And valid embed And request connect errors ' +
      'When retrieving channel Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'post')
        .yields(expectedError, null, null);

      const analyticsService: AnalyticsService = new AnalyticsService(client);
      return analyticsService.generateEmbed('some-embed-code', 'America/New_York').then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V2}${Resource.ANALYTICS}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid embed code ' +
      'When generating embed Then return a rejected promise with 400 status code ' +
      'And invalid embed message', () => {

      const response = {
        status: 400,
        config: {
          method: 'POST'
        }
      };
      const clientGetStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedChannelApeErrorResponse);

      const analyticsService: AnalyticsService = new AnalyticsService(client);
      return analyticsService.generateEmbed('some-embed-code', 'America/New_York').then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V2}${Resource.ANALYTICS}`);
        expectChannelApeErrorResponse(e);
      });
    });

    it('And user has analytics enabled ' +
      'When retrieving report list Then return report list', async () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, {
          errors: [],
          reports: expectedReportList
        });

      const analyticsService: AnalyticsService = new AnalyticsService(client);
      const actualReportListResponse = await analyticsService.get();
      expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.ANALYTICS}`);
      expectReportList(actualReportListResponse);
    });

    it('When generating token Then return resolved promise with token', () => {
      const expectedToken = {
        accessToken: 'someAccessToken'
      };
      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };
      const stub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedToken);

      const analyticsService: AnalyticsService = new AnalyticsService(client);
      return analyticsService.getToken().then((token: Token) => {
        expect(stub.args[0][0]).to.equal(`/${Version.V2}${Resource.ANALYTICS}/tokens`);
        expect(token.accessToken).to.equal(expectedToken.accessToken);
      });
    });

    function expectEmbed(actualEmbed: Embed) {
      expect(actualEmbed.embedUrl).to.equal(expectedEmbed.embedUrl);
      expect(actualEmbed.expiration.toISOString()).to.equal(expectedEmbed.expiration.toISOString());
    }

    function expectReportList(actualReportList: any) {
      expect(actualReportList.length).to.equal(expectedReportList.length);
      for (const actualReport of actualReportList) {
        const expectedReport = expectedReportList.find(temp => temp.name === actualReport.name);
        if (expectedReport) {
          expect(actualReport.category).to.equal(expectedReport.category);
          expect(actualReport.embedCode).to.equal(expectedReport.embedCode);
          expect(actualReport.name).to.equal(expectedReport.name);
        }
      }
    }

    function expectChannelApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(400);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
