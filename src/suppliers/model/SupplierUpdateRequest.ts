import Supplier from './Supplier';

export default interface SupplierUpdateRequest extends Partial<Supplier> {
  createdAt?: Date;
  updatedAt?: Date;
}
