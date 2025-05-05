export class ShippingAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShippingAlreadyExistsException';
  }
} 