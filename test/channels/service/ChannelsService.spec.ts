import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import ChannelsService from './../../../src/channels/service/ChannelsService';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
import Channel from '../../../src/channels/model/Channel';
import RequestClientWrapper from '../../../src/RequestClientWrapper';

describe('Channels Service', () => {

  describe('Given some rest client', () => {
    const client: RequestClientWrapper =
      new RequestClientWrapper(
        60000,
        'valid-session-id',
        LogLevel.OFF,
        Environment.STAGING,
        10000,
        50,
        50
      );

    let sandbox: sinon.SinonSandbox;

    const expectedChannel: Channel = {
      businessId: '4baafa5b-4fbf-404e-9766-8a02ad45c3a4',
      id: '9c728601-0286-457d-b0d6-ec19292d4485',
      enabled: true,
      integrationId: '02df0b31-a071-4791-b9c2-aa01e4fb0ce6',
      name: 'Custom Column Export',
      settings: {
        allowCreate: false,
        allowRead: true,
        allowUpdate: false,
        allowDelete: false,
        disableVariants: false,
        priceType: 'retail',
        updateFields: [
          'images',
          'inventoryQuantity',
          'vendor',
          'price',
          'weight',
          'description',
          'title',
          'tags'
        ]
      },
      createdAt: new Date('2018-02-22T16:04:29.030Z'),
      updatedAt: new Date('2018-04-02T13:04:27.299Z')
    };

    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 70,
          message: 'Channel could not be found for business.'
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

    it('And valid channel ID ' +
      'When retrieving channel Then return resolved promise with channel', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannel);

      const channelsService: ChannelsService = new ChannelsService(client);
      return channelsService.get(expectedChannel.id).then((actualAction) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.CHANNELS}/${expectedChannel.id}`);
        expectChannel(expectedChannel);
      });
    });

    it('And valid channel ID And request connect errors ' +
      'When retrieving channel Then return a rejected promise with an error', () => {

      const clientGetStub = sandbox.stub(client, 'get')
        .yields(expectedError, null, null);

      const channelsService: ChannelsService = new ChannelsService(client);
      return channelsService.get(expectedChannel.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.CHANNELS}/${expectedChannel.id}`);
        expect(e).to.equal(expectedError);
      });
    });

    it('And invalid channel ID ' +
      'When retrieving channel Then return a rejected promise with 404 status code ' +
      'And channel not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const channelsService: ChannelsService = new ChannelsService(client);
      return channelsService.get(expectedChannel.id).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((e) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.CHANNELS}/${expectedChannel.id}`);
        expectChannelApeErrorResponse(e);
      });
    });

    function expectChannel(actualChannel: Channel) {
      expect(actualChannel.id).to.equal(expectedChannel.id);
      expect(actualChannel.businessId).to.equal(expectedChannel.businessId);
      expect(actualChannel.integrationId).to.equal(expectedChannel.integrationId);
      expect(actualChannel.name).to.equal(expectedChannel.name);
      expect(actualChannel.enabled).to.equal(expectedChannel.enabled);
      expect(actualChannel.settings.allowCreate).to.equal(expectedChannel.settings.allowCreate);
      expect(actualChannel.settings.allowRead).to.equal(expectedChannel.settings.allowRead);
      expect(actualChannel.settings.allowUpdate).to.equal(expectedChannel.settings.allowUpdate);
      expect(actualChannel.settings.allowDelete).to.equal(expectedChannel.settings.allowDelete);
      expect(actualChannel.settings.disableVariants).to.equal(expectedChannel.settings.disableVariants);
      expect(actualChannel.settings.priceType).to.equal(expectedChannel.settings.priceType);
      expect(actualChannel.settings.updateFields).to.have.same.members(expectedChannel.settings.updateFields);
      expect(actualChannel.createdAt.toISOString()).to.equal(expectedChannel.createdAt.toISOString());
      expect(actualChannel.updatedAt.toISOString()).to.equal(expectedChannel.updatedAt.toISOString());
    }

    function expectChannelApeErrorResponse(error: any) {
      const actualChannelApeErrorResponse = error as ChannelApeApiErrorResponse;
      expect(actualChannelApeErrorResponse.statusCode).to.equal(404);
      expect(actualChannelApeErrorResponse.errors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
      expect(actualChannelApeErrorResponse.errors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
    }

  });
});
