import ClientConfiguration from '../src/model/ClientConfiguration';
import Session from '../src/sessions/model/Session';
import ChannelApeError from '../src/model/ChannelApeError';
import ChannelApeErrorResponse from '../src/model/ChannelApeErrorResponse';
import ChannelApeClient from '../src/ChannelApeClient';
import { expect } from 'chai';

describe('ChannelApe Client', () => {

  describe('Given invalid session ID', () => {

    const channelApeClient = new ChannelApeClient({
      sessionId: 'c14fefcf-2594-4d39-b927-71fde1210bd4'
    });

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.sessions().get();

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

    const channelApeClient = new ChannelApeClient({
      sessionId
    });

    context('When retrieving session', () => {
      const actualSessionPromise = channelApeClient.sessions().get();

      it('Then return session ID and user ID', () => {
        return actualSessionPromise.then((actualSession) => {
          expect(actualSession.userId).to.equal('addb5bac-d629-4179-a2a8-790763163fcb');
          expect(actualSession.sessionId).to.equal(sessionId);
        });
      });
    });

    describe('And valid action ID for action with error processing status', () => {
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
            expect(actualAction.lastHealthCheckTime.toISOString())
              .to.equal(new Date('2018-04-24T14:02:34.703Z').toISOString());
            expect(actualAction.processingStatus).to.equal('error');
            expect(actualAction.startTime.toISOString())
              .to.equal(new Date('2018-04-24T14:02:34.703Z').toISOString());
            expect(actualAction.targetId).to.equal('1e4ebaa6-9796-4ccf-bd73-8765893a66bd');
            expect(actualAction.targetType).to.equal('supplier');
            expect(actualAction.endTime).to.equal(undefined);
          });
        });
      });
    });

    describe('And valid action ID for action with completed processing status', () => {
      context('When retrieving action', () => {
        const expectedActionId = '4da63571-a4c5-4774-ae20-4fee24ab98e5';
        const actualActionPromise = channelApeClient.actions().get(expectedActionId);

        it('Then return action', () => {
          return actualActionPromise.then((actualAction) => {
            expect(actualAction.action).to.equal('PRODUCT_PUSH');
            expect(actualAction.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualAction.description).to.equal('Completed product push for Custom Column Export');
            expect(actualAction.healthCheckIntervalInSeconds).to.equal(300);
            expect(actualAction.id).to.equal(expectedActionId);
            expect(actualAction.lastHealthCheckTime.toISOString())
              .to.equal(new Date('2018-05-01T14:47:58.018Z').toISOString());
            expect(actualAction.processingStatus).to.equal('completed');
            expect(actualAction.startTime.toISOString())
              .to.equal(new Date('2018-05-01T14:47:55.905Z').toISOString());
            expect(actualAction.targetId).to.equal('9c728601-0286-457d-b0d6-ec19292d4485');
            expect(actualAction.targetType).to.equal('channel');
            if (actualAction.endTime == null) {
              expect(actualAction.endTime).to.not.equal(undefined);
            } else {
              expect(actualAction.endTime.toISOString())
                .to.equal(new Date('2018-05-01T14:47:58.018Z').toISOString());
            }
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

    describe('And valid channel ID', () => {
      context('When retrieving channel', () => {
        const expectedChannelId = '9c728601-0286-457d-b0d6-ec19292d4485';
        const actualChannelPromise = channelApeClient.channels().get(expectedChannelId);

        it('Then return channel', () => {
          return actualChannelPromise.then((actualChannel) => {
            expect(actualChannel.id).to.equal('9c728601-0286-457d-b0d6-ec19292d4485');
            expect(actualChannel.businessId).to.equal('4baafa5b-4fbf-404e-9766-8a02ad45c3a4');
            expect(actualChannel.enabled).to.equal(true);
            expect(actualChannel.integrationId).to.equal('02df0b31-a071-4791-b9c2-aa01e4fb0ce6');
            expect(actualChannel.name).to.equal('Custom Column Export');
            expect(actualChannel.settings.allowCreate).to.equal(false);
            expect(actualChannel.settings.allowRead).to.equal(true);
            expect(actualChannel.settings.allowUpdate).to.equal(false);
            expect(actualChannel.settings.allowDelete).to.equal(false);
            expect(actualChannel.settings.disableVariants).to.equal(false);
            expect(actualChannel.settings.priceType).to.equal('retail');
            expect(actualChannel.settings.updateFields).to.have.same.members([
              'images',
              'inventoryQuantity',
              'vendor',
              'price',
              'weight',
              'description',
              'title',
              'tags'
            ]);
            const expectedCreatedAt = new Date('2018-02-22T16:04:29.030Z');
            expect(actualChannel.createdAt.toISOString()).to.equal(expectedCreatedAt.toISOString());
            expect(actualChannel.updatedAt.getUTCMilliseconds())
              .to.be.greaterThan(expectedCreatedAt.getUTCMilliseconds());
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
