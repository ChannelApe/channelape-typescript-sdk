import Action from './Action';
import PaginationResponse from '../../model/PaginationResponse';

export default interface ActionsPage {
  actions: Action[];
  pagination: PaginationResponse;
}
