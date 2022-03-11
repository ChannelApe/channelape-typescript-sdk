import RequestClientWrapper from '../../RequestClientWrapper';
import Version from '../../model/Version';
import Resource from '../../model/Resource';
import { AxiosResponse } from 'axios';
import GenerateApiError from '../../utils/GenerateApiError';
import * as Q from 'q';
import Recipe from '../model/Recipe';

const EXPECTED_GET_STATUS = 200;
export default class RecipesService {
  constructor(
      private readonly client: RequestClientWrapper
    ) { }
  public getAll(businessId: string): Promise<Recipe[]> {
    const deferred = Q.defer<Recipe[]>();
    const requestUrl = `/${Version.V1}${Resource.RECIPES}?businessId=${businessId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapRecipePromises(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  public get(recipeId: string): Promise<Recipe> {
    const deferred = Q.defer<Recipe>();
    const requestUrl = `/${Version.V1}${Resource.RECIPES}/${recipeId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapRecipePromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  private mapRecipePromise(requestUrl: string, deferred: Q.Deferred<Recipe>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const recipe: Recipe = body;
      deferred.resolve(recipe);
    } else {
      const recipeApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(recipeApeErrorResponse);
    }
  }
  private mapRecipePromises(requestUrl: string, deferred: Q.Deferred<Recipe[]>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const recipes: Recipe[] = body.recipes;
      deferred.resolve(recipes);
    } else {
      const recipeApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(recipeApeErrorResponse);
    }
  }
}
