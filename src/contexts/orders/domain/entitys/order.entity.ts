import {
  OrderStatus,
  OrderStatusEnum,
} from '@orders/domain/value-objects/order-status.vo';
import { OrderItem, OrderItemPrimitives } from '@orders/domain/entitys/order-item.entity';
export interface OrderData {
  id: string;
  orderItems: OrderItemPrimitives[];
  totalAmount: number;
  userId: string;
  status: string;
  createdAt: Date;
  paymentGatewayRef?: string;
}
export class Order {
  public readonly id: string;
  private _status: OrderStatus;
  public readonly orderItems: OrderItem[];
  public readonly createdAt: Date;
  public paymentGatewayRef?: string;
  public readonly totalAmount: number;
  public readonly userId: string;
  constructor(
    id: string,
    orderItems: OrderItem[],
    status: OrderStatus,
    totalAmount: number,
    userId: string,
    paymentGatewayRef?: string,
    createdAt?: Date,
  ) {

    this.id = id;
    this.orderItems = orderItems;
    this.status = status;
    this.totalAmount = totalAmount; 
    this.userId = userId;
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
      return;
    }
    this.status = new OrderStatus(OrderStatusEnum.REJECTED);
  }

  static fromPrimitives(data: OrderData): Order {
    const orderItems = data.orderItems.map((item) => OrderItem.fromPrimitives(item));
    const status = OrderStatus.fromString(data.status);

    return new Order(
      data.id,
      orderItems,
      status,
      data.totalAmount,
      data.userId,
      data.paymentGatewayRef,
      data.createdAt,
    );
  }

  toPrimitives(): OrderData {
    return {
      id: this.id,
      status: this.status.value,
      orderItems: this.orderItems.map((item) => item.toPrimitives()),
      totalAmount: this.totalAmount,
      userId: this.userId,
      paymentGatewayRef: this.paymentGatewayRef,
      createdAt: this.createdAt,
    };
  }
}
