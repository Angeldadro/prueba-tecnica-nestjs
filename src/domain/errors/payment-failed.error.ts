export class PaymentFailedException extends Error {
  constructor(message: string) {
    super(`Payment failed: ${message}`);
    this.name = 'PaymentFailedException';
  }
}
