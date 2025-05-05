export class CardDetails {
  constructor(
    public readonly number: string,
    public readonly cvc: string,
    public readonly expMonth: string,
    public readonly expYear: string,
    public readonly cardHolder: string,
  ) {}

  getSafeDetails(): { last4: string } {
    return {
      last4: this.number.slice(-4),
    };
  }
}
