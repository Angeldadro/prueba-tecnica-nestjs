export class InvalidShippingStatusException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidShippingStatusException';
  }
} 