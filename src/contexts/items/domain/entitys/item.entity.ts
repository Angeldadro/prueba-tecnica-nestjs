import { Price } from '@items/domain/value-objects/price.vo'; 
import { Stock } from '@items/domain/value-objects/stock.vo';
import { InsufficientStockException } from '@items/domain/errors/insufficient-stock.error';
export class Item {
  public readonly id: string;
  public name: string;
  public description?: string;
  private _price: Price;
  private _stock: Stock;

  constructor(
    name: string,
    price: number,
    stock: number,
    id: string,
    description?: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = new Price(price);
    this.stock = new Stock(stock);
  }

  get price(): Price {
    return this._price;
  }
  get stock(): Stock {
    return this._stock;
  }
  set price(value: Price) {
    this._price = value;
  }
  set stock(value: Stock) {
    this._stock = value;
  }

  hasStock(quantity: number): boolean {
    return this.stock.value >= quantity;
  }

  decreaseStock(quantity: number): void {
    try {
      this.stock = this.stock.decrement(quantity);
    } catch {
      throw new InsufficientStockException(this.id, quantity, this.stock.value);
    }
  }

  increaseStock(quantity: number): void {
    this.stock = this.stock.increment(quantity);
  }
  toPrimitives(): {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
  } {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price.value,
      stock: this.stock.value,
    };
  }

  static fromPrimitives(itemData: {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
  }): Item {
    return new Item(
      itemData.name,
      itemData.price,
      itemData.stock,
      itemData.id,
      itemData.description,
    );
  }
}
