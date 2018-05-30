import Action from './Action';
import PaginationResponse from '../../model/PaginationResponse';

export default interface Actions {
  actions: Action[];
  pagination: PaginationResponse;
}
