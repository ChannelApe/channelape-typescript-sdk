import ClientConfiguration from './../../src/model/ClientConfiguration';
import ClientConfigurationBuilder from './../../src/model/ClientConfigurationBuilder';
import Environment from './../../src/model/Environment';
import { expect } from 'chai';

describe('ClientConfigurationBuilder', () => {

  describe('Given some session ID', () => {

    const expectedSessionId : string = '200204242';

    const clientConfigurationBuilder = new ClientConfigurationBuilder().setSessionId(expectedSessionId);

    describe('When building ClientConfiguration', () => {
      it('Then expect ClientConfiguration with default endpoint and some session', () => {
        const actualClientConfiguration = clientConfigurationBuilder.build();
        expect(actualClientConfiguration.SessionId).to.equal(expectedSessionId);
        expect(actualClientConfiguration.hasSession()).to.equal(true);
        expect(actualClientConfiguration.Username).to.equal('');
        expect(actualClientConfiguration.Password).to.equal('');
        expect(actualClientConfiguration.Endpoint).to.equal(Environment.PRODUCTION);
        expect(actualClientConfiguration.hasCredentials()).to.equal(false);
      });
    });

  });

  describe('Given some username, password, and endpoint', () => {

    const expectedUsername : string = 'jim';
    const expectedPassword : string = 'jim2';
    const expectedEndpoint : string = 'https://jim-api.channelape.com';

    const clientConfigurationBuilder = new ClientConfigurationBuilder()
      .setUsername(expectedUsername).setPassword(expectedPassword).setEndpoint(expectedEndpoint);

    describe('When building ClientConfiguration', () => {
      it('Then expect ClientConfiguration with credentials and some endpoint', () => {
        const actualClientConfiguration = clientConfigurationBuilder.build();
        expect(actualClientConfiguration.Username).to.equal(expectedUsername);
        expect(actualClientConfiguration.Password).to.equal(expectedPassword);
        expect(actualClientConfiguration.SessionId).to.equal('');
        expect(actualClientConfiguration.hasCredentials()).to.equal(true);

        expect(actualClientConfiguration.Endpoint).to.equal(expectedEndpoint);
        expect(actualClientConfiguration.hasSession()).to.equal(false);
      });
    });

  });

  describe('Given some username', () => {

    const expectedUsername : string = 'jim';

    const clientConfigurationBuilder = new ClientConfigurationBuilder()
      .setUsername(expectedUsername);

    describe('When building ClientConfiguration', () => {
      it('Then expect ClientConfiguration without credentials and default endpoint', () => {
        const actualClientConfiguration = clientConfigurationBuilder.build();
        expect(actualClientConfiguration.Username).to.equal(expectedUsername);
        expect(actualClientConfiguration.Password).to.equal('');
        expect(actualClientConfiguration.SessionId).to.equal('');
        expect(actualClientConfiguration.hasCredentials()).to.equal(false);

        expect(actualClientConfiguration.Endpoint).to.equal(Environment.PRODUCTION);
        expect(actualClientConfiguration.hasSession()).to.equal(false);
      });
    });

  });
});
