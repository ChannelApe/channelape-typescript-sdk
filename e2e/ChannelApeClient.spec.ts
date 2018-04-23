import ClientConfigurationBuilder from '../src/model/ClientConfigurationBuilder';
import ClientConfiguration from '../src/model/ClientConfiguration';
import SessionResponse from '../src/auth/model/SessionResponse';
import ChannelApeError from '../src/auth/model/ChannelApeError';
import ChannelapeClient from '../src/ChannelapeClient';
import { expect } from 'chai';

describe('ChannelApe Client', () => {

  describe('Given invalid username and password', () => {

    const clientConfiguration = new ClientConfigurationBuilder()
      .setEmail('jim@test.com').setPassword('jim55#899').build();
    const channelApeClient = new ChannelapeClient(clientConfiguration);

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.getSession();

      it('Then return invalid email or password error message', () => {
        return actualSessionPromise.then((actualSession) => {
          expect(actualSession.userId).to.equal(undefined);
          expect(actualSession.sessionId).to.equal(undefined);

          const expectedChannelApeErrors = [{
            code: 2,
            message: 'Invalid email or password.'
          }];
          assertChannelApeErrors(expectedChannelApeErrors, actualSession.errors);
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

      it('Then return invalid auth token error message', () => {
        return actualSessionPromise.then((actualSession) => {

          expect(actualSession.userId).to.equal(undefined);
          expect(actualSession.sessionId).to.equal(undefined);

          const expectedChannelApeErrors = [{
            code: 12,
            message: 'Invalid authorization token. Please check the server logs and try again.'
          }];
          assertChannelApeErrors(expectedChannelApeErrors, actualSession.errors);
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

          assertChannelApeErrors([], actualSession.errors);

          expect(actualSession.userId).to.equal('addb5bac-d629-4179-a2a8-790763163fcb');
          expect(actualSession.sessionId).to.equal(sessionId);
        });
      });
    });
  });

  describe('Given valid username and password', () => {
    const email = getEmail();
    const password = getPassword();

    const clientConfiguration = new ClientConfigurationBuilder()
      .setEmail(email).setPassword(password).build();
    const channelApeClient = new ChannelapeClient(clientConfiguration);

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.getSession();

      it('Then return session ID and user ID', () => {
        return actualSessionPromise.then((actualSession) => {

          assertChannelApeErrors([], actualSession.errors);

          if (Array.isArray(actualSession.errors)) {
            expect(actualSession.errors.length).to.equal(0);
          }
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

  function getEmail(): string {
    const emailEnvironmentVariable = process.env.CHANNEL_APE_EMAIL;
    if (emailEnvironmentVariable == null) {
      throw new Error('CHANNEL_APE_EMAIL environment variable is required for');
    }
    return emailEnvironmentVariable;
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
