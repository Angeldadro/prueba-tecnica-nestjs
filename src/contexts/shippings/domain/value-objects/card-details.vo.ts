
export interface CardDetailsPrimitives {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

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

  public static fromPrimitives(
    data: CardDetailsPrimitives | null,
  ): CardDetails | null {
    if (!data) return null;
    return new CardDetails(
      data.cardNumber,
      data.expiryMonth, 
      data.expiryYear,
      data.cvv
    );
  }
}
