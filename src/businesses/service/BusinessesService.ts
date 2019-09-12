import Business from '../model/Business';
import RequestClientWrapper from '../../RequestClientWrapper';
import BusinessesQueryRequestByUserId from '../model/BusinessesQueryRequestByUserId';
import BusinessesQueryRequestByBusinessId from '../model/BusinessesQueryRequestByBusinessId';
import BusinessesCrudService from './BusinessesCrudService';
import BusinessCreateRequest from '../model/BusinessCreateRequest';
import { BusinessMemberRequest } from '../model/BusinessMemberRequest';
import { BusinessMember } from '../model/BusinessMember';

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

  public getBusinessMember(request: BusinessMemberRequest): Promise<BusinessMember> {
    return this.businessesCrudService.getBusinessMember(request);
  }

  public verifyBusinessMember(verificationCode: string): Promise<Business> {
    return this.businessesCrudService.verifyBusinessMember(verificationCode);
  }

  public create(business: BusinessCreateRequest): Promise<Business> {
    return this.businessesCrudService.create(business);
  }

}
