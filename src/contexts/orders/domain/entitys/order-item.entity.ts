import { Price } from '@orders/domain/value-objects/price.vo';

export interface OrderItemPrimitives {
  id: string;
  itemId: string;
  quantity: number;
  priceAtOrder: number;
}

export class OrderItem {
  private _id: string;
  private _quantity: number;
  private _priceAtOrder: Price;
  private _itemId: string;

  constructor(
    id: string,
    itemId: string,
    quantity: number,
    priceAtOrder: number,
  ) {
    this._id = id;
    this._itemId = itemId;
    this._quantity = quantity;
    this._priceAtOrder = new Price(priceAtOrder);
  }

  toPrimitives(): OrderItemPrimitives {
    return {
      id: this._id,
      itemId: this._itemId,
      quantity: this.quantity,
      priceAtOrder: this.priceAtOrder,
    };
  }

  static fromPrimitives(data: OrderItemPrimitives): OrderItem {
    return new OrderItem(
      data.id,
      data.itemId,
      data.quantity,
      data.priceAtOrder,
    );
  }

  get id(): string {
    return this._id;
  }

  get quantity(): number {
    return this._quantity;
  }

  get priceAtOrder(): number {
    return this._priceAtOrder.value;
  }

  get itemId(): string {
    return this._itemId;
  }
} 