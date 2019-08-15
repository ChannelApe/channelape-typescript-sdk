import Business from '../model/Business';
import RequestClientWrapper from '../../RequestClientWrapper';
import BusinessesQueryRequestByUserId from '../model/BusinessesQueryRequestByUserId';
import BusinessesQueryRequestByBusinessId from '../model/BusinessesQueryRequestByBusinessId';
import BusinessesCrudService from './BusinessesCrudService';
import BusinessCreateRequest from '../model/BusinessCreateRequest';
import { UserBusinessPermissionsQueryRequest } from '../model/UserBusinessPermissionsQueryRequest';
import { UserBusinessPermissions } from '../model/UserBusinessPermissions';

export default class BusinessesService {

  private readonly businessesCrudService: BusinessesCrudService;

  constructor(private readonly client: RequestClientWrapper) {
    this.businessesCrudService = new BusinessesCrudService(this.client);
  }

  public get(request: BusinessesQueryRequestByUserId): Promise<Business[]>;
  public get(request: BusinessesQueryRequestByBusinessId): Promise<Business>;
  public get(
    request: BusinessesQueryRequestByUserId & BusinessesQueryRequestByBusinessId
  ): Promise<Business[]> | Promise<Business> {
    return this.businessesCrudService.get(request);
  }

  public getUserBusinessPermissions(request: UserBusinessPermissionsQueryRequest): Promise<UserBusinessPermissions> {
    return this.businessesCrudService.getUserBusinessPermissions(request);
  }

  public create(business: BusinessCreateRequest): Promise<Business> {
    return this.businessesCrudService.create(business);
  }

}
