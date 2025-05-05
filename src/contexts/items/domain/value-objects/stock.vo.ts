export class Stock {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Stock must be a non-negative integer.');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }


  increment(amount: number): Stock {
    if (!Number.isInteger(amount) || amount < 0) {
      throw new Error('Increment amount must be a non-negative integer.');
    }
    return new Stock(this._value + amount);
  }

  decrement(amount: number): Stock {  
    if (!Number.isInteger(amount) || amount < 0) {
      throw new Error('Decrement amount must be a non-negative integer.');
    }
    if (this._value - amount < 0) {
      throw new Error('Cannot decrement stock below zero.');
    }
    return new Stock(this._value - amount);
  }
}
