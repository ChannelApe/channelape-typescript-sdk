import ClientConfigurationBuilder from '../src/model/ClientConfigurationBuilder';
import ClientConfiguration from '../src/model/ClientConfiguration';
import SessionResponse from '../src/auth/model/SessionResponse';
import ChannelApeError from '../src/auth/model/ChannelApeError';
import ChannelapeClient from '../src/ChannelapeClient';
import { expect } from 'chai';

describe('ChannelApe Client', () => {
  describe('Given invalid username and password', () => {

    const clientConfiguration = new ClientConfigurationBuilder()
      .setEmail('jim@test.com').setPassword('jim').build();
    const channelApeClient = new ChannelapeClient(clientConfiguration);

    describe('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.getSession();

      it('Then return invalid auth error message', () => {
        return actualSessionPromise.then((actualSession: SessionResponse) => {
          expect(actualSession.userId).to.equal(undefined);
          expect(actualSession.sessionId).to.equal(undefined);
          const actualErrors = actualSession.errors;

          expect(Array.isArray(actualErrors)).to.equal(true, 'Errors should be array');

          if (Array.isArray(actualErrors)) {
            expect(actualErrors.length).to.equal(1);
            expect(actualErrors[0].code).to.equal(2);
            expect(actualErrors[0].message).to.equal('Invalid email or password.');
          }
        });
      });
    });
  });
});
