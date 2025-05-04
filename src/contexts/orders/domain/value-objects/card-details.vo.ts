export class CardDetails {
  constructor(
    public readonly cardNumber: string,
    public readonly expiryMonth: string,
    public readonly expiryYear: string,
    public readonly cvv: string,
  ) {
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
      throw new Error('Card details are incomplete.');
    }
  }

  getSafeDetails(): { last4: string } {
    return {
      last4: this.cardNumber.slice(-4),
    };
  }
}
