import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import UsersService from './../../../src/users/service/UsersService';

describe('Users Service', () => {

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

    it.only('And valid userId ' +
      'When getting user information Then return resolved promise with user', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedUser = {
        analyticsEnabled: true,
        errors: [],
        id: 'some-user-id',
        username: 'jdoe@channelape.com',
        verified: true
      };

      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedUser);

      const usersService: UsersService = new UsersService(client);
      return usersService.get(expectedUser.id).then((actualUser: any) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.USERS}/${expectedUser.id}`);
        expect(actualUser.id).to.equal(expectedUser.id);
        expect(actualUser.errors.length).to.equal(expectedUser.errors.length);
        expect(actualUser.username).to.equal(expectedUser.username);
        expect(actualUser.verified).to.equal(expectedUser.verified);
        expect(actualUser.analyticsEnabled).to.equal(expectedUser.analyticsEnabled);
      });
    });

  });
});
