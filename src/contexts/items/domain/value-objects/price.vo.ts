export class Price {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Price cannot be negative.');
    }
    this._value = parseFloat(value.toFixed(2));
  }

  get value(): number {
    return this._value;
  }
  toString(): string {
    return this._value.toFixed(2);
  }
}
