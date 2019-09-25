import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import UsersService from './../../../src/users/service/UsersService';
import Session from '../../../src/sessions/model/Session';

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

    it('And valid userId ' +
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

    it('And valid username and password ' +
      'When creating a user Then return resolved promise with user', () => {

      const response = {
        status: 201,
        config: {
          method: 'POST'
        }
      };

      const email = 'jdoe@email.com';
      const password = 'abc123';

      const expectedUser = {
        analyticsEnabled: false,
        errors: [],
        id: 'some-user-id',
        username: email,
        verified: false
      };

      const clientStub: sinon.SinonStub = sandbox.stub(client, 'post')
        .yields(null, response, expectedUser);

      const usersService: UsersService = new UsersService(client);
      return usersService.create(email, password).then((actualUser: any) => {
        expect(clientStub.args[0][0]).to.equal(`/${Version.V1}${Resource.USERS}`);
        expect(actualUser.id).to.equal(expectedUser.id);
        expect(actualUser.errors.length).to.equal(expectedUser.errors.length);
        expect(actualUser.username).to.equal(expectedUser.username);
        expect(actualUser.verified).to.equal(expectedUser.verified);
        expect(actualUser.analyticsEnabled).to.equal(expectedUser.analyticsEnabled);
      });
    });

    it('And valid verification token ' +
      'When verifying a user Then return resolved promise with session', () => {

      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };

      const expectedSession = {
        sessionId: 'some-session-id-token',
        creationTime: '2019-09-25T14:41:54.917Z',
        errors: [],
        userId: 'some-user-id'
      };

      const verificationToken = 'some-verification-token';

      const clientStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedSession);

      const usersService: UsersService = new UsersService(client);
      return usersService.verify(verificationToken).then((actualSession: any) => {
        expect(clientStub.args[0][0]).to.equal(`${Resource.VERIFICATION}/${verificationToken}`);
        expect(actualSession.sessionId).to.equal(expectedSession.sessionId);
        expect(actualSession.userId).to.equal(expectedSession.userId);
        expect(actualSession.creationTime).to.equal(expectedSession.creationTime);
        expect(actualSession.errors.length).to.equal(expectedSession.errors.length);
      });
    });

  });
});
