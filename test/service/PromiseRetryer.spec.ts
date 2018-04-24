import { expect, assert } from 'chai';
import PromiseRetryer from './../../src/service/PromiseRetryer';
import * as Q from 'q';
import Response from './../../src/model/Response';
import * as sinon from 'sinon';

describe('Promise Retryer', () => {

  describe('given some min delay, some max attempts, ' +
  'some base, some retry function, some final response codes', () => {
    it('when response is in the final response codes, then resolve the promise', () => {
      const response = new Response({ statusCode: 200 }, { test: 'testing' });
      const someRetryFunction = () => {
        const deferred = Q.defer();
        
        deferred.resolve(response);
        return deferred.promise;
      };

      const spy = sinon.spy(someRetryFunction);
      const promiseRetryer = new PromiseRetryer('PromiseRetryerTest')
      .setMinDelay(12)
      .setMaxAttempts(3)
      .setBase(12)
      .setRetryFunction(someRetryFunction)
      .setFinalResponseCodes([200, 401, 404]);

      return promiseRetryer.run().then((data) => {
        expect(spy.callCount).to.equal(0);
        expect(data).to.equal(response);
      });
    });

    it('when response is not in the final response codes, '
    + 'then keep retrying until max attempts exceeds and resolve the promise', () => {
      const response = new Response({ statusCode: 500 }, { test: 'testing' });
      const someRetryFunction = () => {
        const deferred = Q.defer();
        
        deferred.resolve(response);
        return deferred.promise;
      };

      const spy = sinon.spy(someRetryFunction);
      const promiseRetryer = new PromiseRetryer('PromiseRetryerTest')
      .setMinDelay(12)
      .setMaxAttempts(3)
      .setBase(12)
      .setRetryFunction(spy)
      .setFinalResponseCodes([200, 401, 404]);

      return promiseRetryer.run().then((data) => {
        expect(spy.callCount).to.equal(4);
        expect(data).to.equal(response);
      });
    });

    

    it('when response is rejected promise'
    + 'then keep retrying until max attempts exceeds and resolve the promise', () => {
      const errorResponse = 'error in connection';
      const someRetryFunction = () => {
        const deferred = Q.defer();
        
        deferred.reject(errorResponse);
        return deferred.promise;
      };

      const spy = sinon.spy(someRetryFunction);
      const promiseRetryer = new PromiseRetryer('PromiseRetryerTest')
      .setMinDelay(12)
      .setMaxAttempts(3)
      .setBase(12)
      .setRetryFunction(spy)
      .setFinalResponseCodes([200, 401, 404]);

      return promiseRetryer.run().then(() => {
        assert.fail(0, 1, 'Exception not thrown in promise retryer');
      }).catch((error) => {
        expect(spy.callCount).to.equal(4);
        expect(error.message).to.equal(errorResponse);
      });
    });
  });
});
