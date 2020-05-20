export class UnknownStatusError extends Error {
  constructor(...args: any[]) {
    super(...args);
    Object.setPrototypeOf(this, UnknownStatusError.prototype);
  }
}
