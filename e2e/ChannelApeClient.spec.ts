import ClientConfigurationBuilder from '../src/model/ClientConfigurationBuilder';
import ClientConfiguration from '../src/model/ClientConfiguration';
import Session from '../src/sessions/model/Session';
import ChannelApeError from '../src/model/ChannelApeError';
import ChannelApeErrorResponse from '../src/model/ChannelApeErrorResponse';
import ChannelapeClient from '../src/ChannelapeClient';
import { expect } from 'chai';

describe('ChannelApe Client', () => {

  describe('Given invalid username and password', () => {

    const clientConfiguration = new ClientConfigurationBuilder()
      .setUsername('jim@test.com').setPassword('jim55#899').build();
    const channelApeClient = new ChannelapeClient(clientConfiguration);

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.getSession();

      it('Then return invalid email or password error message', (done) => {
        actualSessionPromise.then((actualSession) => {
          expect(actualSession.userId).to.equal(undefined);
          expect(actualSession.sessionId).to.equal(undefined);
        }).catch((e) => {
          const actualChannelApeErrorResponse = e as ChannelApeErrorResponse;
          expect(actualChannelApeErrorResponse.statusCode).to.equal(401);
          const expectedChannelApeErrors = [{
            code: 2,
            message: 'Invalid email or password.'
          }];
          assertChannelApeErrors(expectedChannelApeErrors, actualChannelApeErrorResponse.errors); 
          done();
        });
      });
    });
  });

  describe('Given invalid session ID', () => {

    const clientConfiguration = new ClientConfigurationBuilder()
      .setSessionId('c14fefcf-2594-4d39-b927-71fde1210bd4').build();
    const channelApeClient = new ChannelapeClient(clientConfiguration);

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.getSession();

      it('Then return 401 status code and invalid auth token error message', (done) => {
        actualSessionPromise.then((actualSession) => {
          expect(actualSession.userId).to.equal(undefined);
          expect(actualSession.sessionId).to.equal(undefined);
        }).catch((e) => {
          const actualChannelApeErrorResponse = e as ChannelApeErrorResponse;
          expect(actualChannelApeErrorResponse.statusCode).to.equal(401);
          const expectedChannelApeErrors = [{ 
            code: 12, 
            message: 'Invalid authorization token. Please check the server logs and try again.' 
          }]; 
          assertChannelApeErrors(expectedChannelApeErrors, actualChannelApeErrorResponse.errors); 
          done();
        });
      });
    });
  });

  describe('Given valid session ID', () => {
    const sessionId = getSessionId();

    const clientConfiguration = new ClientConfigurationBuilder()
      .setSessionId(sessionId).build();

    const channelApeClient = new ChannelapeClient(clientConfiguration);

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.getSession();

      it('Then return session ID and user ID', () => {
        return actualSessionPromise.then((actualSession) => {
          expect(actualSession.userId).to.equal('addb5bac-d629-4179-a2a8-790763163fcb');
          expect(actualSession.sessionId).to.equal(sessionId);
        });
      });
    });

    describe('And valid action ID', () => {
      context('When retrieving action', () => {
        const expectedActionId = 'a85d7463-a2f2-46ae-95a1-549e70ecb2ca';
        const actualActionPromise = channelApeClient.getAction(expectedActionId);
  
        it('Then return action', () => {
          return actualActionPromise.then((actualAction) => {
            expect(actualAction.action).to.equal('PRODUCT_PULL');
            expect(actualAction.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualAction.description).to.equal('Encountered error during product pull for Europa Sports');
            expect(actualAction.healthCheckIntervalInSeconds).to.equal(300);
            expect(actualAction.id).to.equal(expectedActionId);
            expect(actualAction.lastHealthCheckTime).to.equal('2018-04-24T14:02:34.703Z');
            expect(actualAction.processingStatus).to.equal('error');
            expect(actualAction.startTime).to.equal('2018-04-24T14:02:34.703Z');
            expect(actualAction.targetId).to.equal('1e4ebaa6-9796-4ccf-bd73-8765893a66bd');
            expect(actualAction.targetType).to.equal('supplier');
          });
        });
      });
    });

    describe('And invalid action ID', () => {
      context('When retrieving action', () => {
        const expectedActionId = '676cb925-b603-4140-a3dd-2af160c257d1';
        const actualActionPromise = channelApeClient.getAction(expectedActionId);
  
        it('Then return 404 status code and action not found error message', () => {
          return actualActionPromise.then((actualAction) => {
            throw new Error('Expected rejected promise');
          }).catch((e) => {
            const actualChannelApeErrorResponse = e as ChannelApeErrorResponse;
            expect(actualChannelApeErrorResponse.statusCode).to.equal(404);
            const expectedChannelApeErrors = [{ 
              code: 111, 
              message: 'Action could not be found.' 
            }]; 
            assertChannelApeErrors(expectedChannelApeErrors, actualChannelApeErrorResponse.errors);
          });
        });
      });
    });
  });

  describe('Given valid username and password', () => {
    const username = getUsername();
    const password = getPassword();

    const clientConfiguration = new ClientConfigurationBuilder()
      .setUsername(username).setPassword(password).build();
    const channelApeClient = new ChannelapeClient(clientConfiguration);

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.getSession();

      it('Then return session ID and user ID', () => {
        return actualSessionPromise.then((actualSession) => {
          expect(actualSession.userId).to.equal('addb5bac-d629-4179-a2a8-790763163fcb');
          expect(actualSession.sessionId.length).to.be.greaterThan(0);
        });
      });
    });
  });

  function getSessionId(): string {
    const sessionIdEnvironmentVariable = process.env.CHANNEL_APE_SESSION_ID;
    if (sessionIdEnvironmentVariable == null) {
      throw new Error('CHANNEL_APE_SESSION_ID environment variable is required for');
    }
    return sessionIdEnvironmentVariable;
  }

  function getUsername(): string {
    const usernameEnvironmentVariable = process.env.CHANNEL_APE_USERNAME;
    if (usernameEnvironmentVariable == null) {
      throw new Error('CHANNEL_APE_USERNAME environment variable is required for');
    }
    return usernameEnvironmentVariable;
  }

  function getPassword(): string {
    const passwordEnvironmentVariable = process.env.CHANNEL_APE_PASSWORD;
    if (passwordEnvironmentVariable == null) {
      throw new Error('CHANNEL_APE_PASSWORD environment variable is required for');
    }
    return passwordEnvironmentVariable;
  }

  function assertChannelApeErrors(expectedChannelApeErrors: ChannelApeError[],
    actualChannelApeErrors: ChannelApeError[] | undefined) {
      
    if (Array.isArray(actualChannelApeErrors)) {
      expect(expectedChannelApeErrors.length).to.equal(actualChannelApeErrors.length,
        'expected and actual ChannelApeError arrays are different sizes, expected: '
        + JSON.stringify(expectedChannelApeErrors) + ', actual: ' + JSON.stringify(actualChannelApeErrors));

      expectedChannelApeErrors
        .sort((leftChannelApeError, rightChannelApeError) => leftChannelApeError.code - rightChannelApeError.code);
      actualChannelApeErrors
        .sort((leftChannelApeError, rightChannelApeError) => leftChannelApeError.code - rightChannelApeError.code);

      expectedChannelApeErrors.forEach((expectedChannelApeError, index) => {
        const actualChannelApeError = actualChannelApeErrors[index];
        expect(actualChannelApeError.code).to.equal(expectedChannelApeError.code,
          'Unexpected code for ChannelApeError at index ' + index);
        expect(actualChannelApeError.message).to.equal(expectedChannelApeError.message,
          'Unexpected message for ChannelApeError at index ' + index);
      });

    } else if (expectedChannelApeErrors.length > 0) {
      expect(Array.isArray(actualChannelApeErrors)).to.equal(true, 'actualChannelApeErrors should be array');
    }

  }

});
