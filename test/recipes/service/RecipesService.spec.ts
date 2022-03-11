import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../../src/model/LogLevel';
import Version from '../../../src/model/Version';
import Resource from '../../../src/model/Resource';
import Environment from '../../../src/model/Environment';
import RequestClientWrapper from '../../../src/RequestClientWrapper';
import Recipe from '../../../src/receipes/model/Recipe';
import RecipesService from '../../../src/receipes/service/RecipesService';
import ChannelApeApiErrorResponse from '../../../src/model/ChannelApeApiErrorResponse';
describe('Recipes Service', () => {

  describe('Given some rest client', () => {
    const client: RequestClientWrapper =
        new RequestClientWrapper({
          endpoint: Environment.STAGING,
          maximumRequestRetryTimeout: 10000,
          timeout: 60000,
          session: 'valid-session-id',
          logLevel: LogLevel.INFO,
          minimumRequestRetryRandomDelay: 50,
          maximumRequestRetryRandomDelay: 50,
          maximumConcurrentConnections: 5
        });
    let sandbox: sinon.SinonSandbox;
    const businessId = '64d70831-c365-4238-b3d8-6077bebca788';
    const expectedAllRecipe: any = {
      errors: [],
      recipes: [
        {
          businessId: '64d70831-c365-4238-b3d8-6077bebca788',
          enabled: false,
          errors: [],
          id: '6f0c1636-f61f-41b7-a0ee-b5303071f006',
          sourceId: '19415e65-e02b-41a3-b0df-e05556be1b13',
          sourceType: 'schedule',
          targetAction: 'INVOKE_PLAY',
          targetId: '060b602c-212f-4a74-ab9e-ac246bd972d5',
          targetType: 'supplier',
        },
        {
          businessId: '64d70831-c365-4238-b3d8-6077bebca788',
          enabled: false,
          errors: [],
          id: 'af2ee30d-0935-4d57-9548-e72140d1d772',
          sourceId: '19415e65-e02b-41a3-b0df-e05556be1b13',
          sourceType: 'schedule',
          targetAction: 'INVOKE_PLAY',
          targetId: '060b602c-212f-4a74-ab9e-ac246bd972d5',
          targetType: 'supplier',
        }
      ]
    };
    const expectedRecipe: Recipe = {
      businessId: '64d70831-c365-4238-b3d8-6077bebca788',
      enabled: false,
      errors: [],
      id: '6f0c1636-f61f-41b7-a0ee-b5303071f006',
      sourceId: '19415e65-e02b-41a3-b0df-e05556be1b13',
      sourceType: 'schedule',
      targetAction: 'INVOKE_PLAY',
      targetId: '060b602c-212f-4a74-ab9e-ac246bd972d5',
      targetType: 'supplier'
    };
    const expectedChannelApeErrorResponse: ChannelApeApiErrorResponse = {
      statusCode: 404,
      errors: [
        {
          code: 101,
          message: 'Recipe could not be found.'
        }
      ]
    };
    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      done();
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });
    it('And retrieve a recipe' +
    ' When retrieving Recipe Then return resolved promise with a Recipe', () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
      .yields(null, response, expectedRecipe);
      const recipeId = '6f0c1636-f61f-41b7-a0ee-b5303071f006';

      const recipeService: RecipesService = new RecipesService(client);
      return recipeService.get(recipeId).then((actualRecipe: Recipe) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.RECIPES}/${recipeId}`);
        expect(actualRecipe['businessId']).to.equal(expectedRecipe['businessId']);
        expect(actualRecipe['sourceId']).to.equal(expectedRecipe['sourceId']);
        expect(actualRecipe['sourceType']).to.equal(expectedRecipe['sourceType']);
        expect(actualRecipe['targetAction']).to.equal(expectedRecipe['targetAction']);
        expect(actualRecipe['targetId']).to.equal(expectedRecipe['targetId']);
        expect(actualRecipe['targetType']).to.equal(expectedRecipe['targetType']);
        expect(actualRecipe['enabled']).to.equal(expectedRecipe['enabled']);
      });
    });
    it('And invalid schedule ID ' +
    'When retrieving Recipe Then return a rejected promise with 404 status code ' +
    'And Recipe not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);
      const recipeId = 'invalid-schedule-id';

      const recipeService: RecipesService = new RecipesService(client);
      return recipeService.get(recipeId).then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((error) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.RECIPES}/${recipeId}`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      });
    });
    it('And retrieve a list of all recipes' +
    ' When retrieving Recipe Then return resolved promise with all Recipes', () => {
      const response = {
        status: 200,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
      .yields(null, response, expectedAllRecipe);

      const recipeService: RecipesService = new RecipesService(client);
      return recipeService.getAll(businessId).then((actualRecipe: Recipe[]) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.RECIPES}?businessId=${businessId}`);
        expect(actualRecipe[0]['businessId']).to.equal(expectedAllRecipe.recipes[0]['businessId']);
        expect(actualRecipe[0]['sourceId']).to.equal(expectedAllRecipe.recipes[0]['sourceId']);
        expect(actualRecipe[0]['sourceType']).to.equal(expectedAllRecipe.recipes[0]['sourceType']);
        expect(actualRecipe[0]['targetAction']).to.equal(expectedAllRecipe.recipes[0]['targetAction']);
        expect(actualRecipe[0]['targetId']).to.equal(expectedAllRecipe.recipes[0]['targetId']);
        expect(actualRecipe[0]['targetType']).to.equal(expectedAllRecipe.recipes[0]['targetType']);
        expect(actualRecipe[0]['enabled']).to.equal(expectedAllRecipe.recipes[0]['enabled']);
      });
    });
    it('And invalid Business ID ' +
    'When retrieving Recipe Then return a rejected promise with 404 status code ' +
    'And Recipe not found error message', () => {

      const response = {
        status: 404,
        config: {
          method: 'GET'
        }
      };
      const clientGetStub: sinon.SinonStub = sandbox.stub(client, 'get')
        .yields(null, response, expectedChannelApeErrorResponse);

      const recipeService: RecipesService = new RecipesService(client);
      return recipeService.getAll('invalid-business-id').then((actualResponse) => {
        expect(actualResponse).to.be.undefined;
      }).catch((error) => {
        expect(clientGetStub.args[0][0]).to.equal(`/${Version.V1}${Resource.RECIPES}?businessId=invalid-business-id`);
        expect(error.Response.statusCode).to.equal(404);
        expect(error.ApiErrors[0].code).to.equal(expectedChannelApeErrorResponse.errors[0].code);
        expect(error.ApiErrors[0].message)
        .to.equal(expectedChannelApeErrorResponse.errors[0].message);
      });
    });
  });
});
