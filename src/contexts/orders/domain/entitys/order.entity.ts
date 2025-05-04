import {
  OrderStatus,
  OrderStatusEnum,
} from '@orders/domain/value-objects/order-status.vo';
import { Price } from '@orders/domain/value-objects/price.vo';

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

  toPrimitives(): {
    id: string;
    itemId: string;
    quantity: number;
    priceAtOrder: number;
  } {
    return {
      id: this._id,
      itemId: this._itemId,
      quantity: this.quantity,
      priceAtOrder: this.priceAtOrder,
    };
  }

  static fromPrimitives(data: {
    id: string;
    itemId: string;
    quantity: number;
    priceAtOrder: number;
  }): OrderItem {
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

export class Order {
  public readonly id: string;
  private _status: OrderStatus;
  public readonly orderItems: OrderItem[];
  public readonly createdAt: Date;
  public paymentGatewayRef?: string;
  public readonly totalAmount: number;

  constructor(
    id: string,
    orderItems: OrderItem[],
    status: OrderStatus,
    totalAmount: number,
    paymentGatewayRef?: string,
    createdAt?: Date,
  ) {
    this.id = id;
    this.orderItems = orderItems.map(
      (item) =>
        new OrderItem(item.id, item.itemId, item.quantity, item.priceAtOrder),
    );
    this.status = status;
    this.totalAmount = totalAmount;
    this.paymentGatewayRef = paymentGatewayRef;
    this.createdAt = createdAt || new Date();
  }

  get status(): OrderStatus {
    return this._status;
  }

  set status(value: OrderStatus) {
    this._status = value;
  }

  markAsProcessed(paymentRef: string): void {
    if (!this.status.isPending()) {
      throw new Error(`Cannot process order in status: ${this.status.value}`);
    }
    this.paymentGatewayRef = paymentRef;
    this.status = new OrderStatus(OrderStatusEnum.APPROVED);
  }

  markAsRejected(): void {
    if (!this.status.isPending()) {
      console.warn(
        `Attempted to reject order in status: ${this.status.value}. State remains ${this.status.value}`,
      );
      return;
    }
    this.status = new OrderStatus(OrderStatusEnum.REJECTED);
  }

  static fromPrimitives(data: {
    id: string;
    status: string;
    totalAmount: number;
    orderItems: {
      id: string;
      itemId: string;
      quantity: number;
      priceAtOrder: number;
    }[];
    paymentGatewayRef?: string;
    createdAt: Date;
  }): Order {
    const orderItems = data.orderItems.map((item) =>
      OrderItem.fromPrimitives(item),
    );
    const status = OrderStatus.fromString(data.status);

    return new Order(
      data.id,
      orderItems,
      status,

      data.totalAmount,
      data.paymentGatewayRef,
      data.createdAt,
    );
  }

  toPrimitives(): {
    id: string;
    status: string;
    orderItems: {
      id: string;
      itemId: string;
      quantity: number;
      priceAtOrder: number;
    }[];
    totalAmount: number;
    paymentGatewayRef?: string;
    createdAt: Date;
  } {
    return {
      id: this.id,
      status: this.status.value,
      orderItems: this.orderItems.map((item) => item.toPrimitives()),
      totalAmount: this.totalAmount,
      paymentGatewayRef: this.paymentGatewayRef,
      createdAt: this.createdAt,
    };
  }
}
