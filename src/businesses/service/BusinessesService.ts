import Business, { BusinessMembers } from '../model/Business';
import RequestClientWrapper from '../../RequestClientWrapper';
import BusinessesQueryRequestByUserId from '../model/BusinessesQueryRequestByUserId';
import BusinessesQueryRequestByBusinessId from '../model/BusinessesQueryRequestByBusinessId';
import BusinessesCrudService from './BusinessesCrudService';
import BusinessCreateRequest from '../model/BusinessCreateRequest';
import { BusinessMemberRequest } from '../model/BusinessMemberRequest';
import { BusinessMember } from '../model/BusinessMember';
import ApiAccountsService from '../apiaccounts/service/ApiAccountsService';
import InvitationResponse from '../model/InvitationResponse';
import RemoveMember from '../model/RemoveMember';

export default class BusinessesService {

  private readonly businessesCrudService: BusinessesCrudService;
  private readonly apiAccountsService: ApiAccountsService;

  constructor(private readonly client: RequestClientWrapper) {
    this.businessesCrudService = new BusinessesCrudService(this.client);
    this.apiAccountsService = new ApiAccountsService(client);
  }

  public apiAccounts(): ApiAccountsService {
    return this.apiAccountsService;
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
  public getBusinessMembers(request: BusinessMemberRequest): Promise<BusinessMembers> {
    return this.businessesCrudService.getBusinessMembers(request);
  }
  public inviteMember(email:string, businessId:string):Promise<InvitationResponse> {
    return this.businessesCrudService.inviteMember(email, businessId);
  }

  public removeMember(businessId:string, userId:string):Promise<RemoveMember> {
    return this.businessesCrudService.removeMember(businessId, userId);
  }
  public update(business: BusinessCreateRequest):Promise<Business> {
    return this.businessesCrudService.update(business);
  }
}
