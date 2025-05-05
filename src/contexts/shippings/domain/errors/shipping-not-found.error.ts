export class ShippingNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShippingNotFoundException';
  }
} 