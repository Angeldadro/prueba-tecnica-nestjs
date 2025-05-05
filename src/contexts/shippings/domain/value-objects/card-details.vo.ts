
export interface CardDetailsPrimitives {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolder: string;
}

export class CardDetails {
  constructor(
    public readonly number: string,
    public readonly expMonth: string,
    public readonly expYear: string,
    public readonly cvc: string,
    public readonly cardHolder: string,
  ) {
    if (!number || !expMonth || !expYear || !cvc || !cardHolder) {
      throw new Error('Card details are incomplete.');
    }
  }

  public static fromPrimitives(
    data: CardDetailsPrimitives | null,
  ): CardDetails | null {
    if (!data) return null;
    return new CardDetails(
      data.number,  
      data.expMonth, 
      data.expYear,
      data.cvc,
      data.cardHolder
    );
  }
}
