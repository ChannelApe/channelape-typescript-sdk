import ClientConfiguration from '../src/model/ClientConfiguration';
import Session from '../src/sessions/model/Session';
import ChannelApeError from '../src/model/ChannelApeError';
import ChannelApeErrorResponse from '../src/model/ChannelApeErrorResponse';
import ChannelApeClient from '../src/ChannelApeClient';
import { expect } from 'chai';

describe('ChannelApe Client', () => {
  describe('Given valid session ID', () => {
    const sessionId = getSessionId();

    const channelApeClient = new ChannelApeClient({
      sessionId
    });

    describe('And valid action ID', () => {
      context('When retrieving action', () => {
        const expectedActionId = 'a85d7463-a2f2-46ae-95a1-549e70ecb2ca';
        const actualActionPromise = channelApeClient.actions().get(expectedActionId);
  
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
        const actualActionPromise = channelApeClient.actions().get(expectedActionId);
  
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

  function getSessionId(): string {
    const sessionIdEnvironmentVariable = process.env.CHANNEL_APE_SESSION_ID;
    if (sessionIdEnvironmentVariable == null) {
      throw new Error('CHANNEL_APE_SESSION_ID environment variable is required.');
    }
    return sessionIdEnvironmentVariable;
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
