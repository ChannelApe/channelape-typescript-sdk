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
        maximumRequestRetryRandomDelay: 50
      });

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
        status: 200,
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

    function expectEmbed(actualEmbed: Embed) {
      expect(actualEmbed.embedUrl).to.equal(expectedEmbed.embedUrl);
      expect(actualEmbed.expiration.toISOString()).to.equal(expectedEmbed.expiration.toISOString());
    }

    function expectChannelApeErrorResponse(error: ChannelApeError) {
      expect(error.Response.statusCode).to.equal(400);
      expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
