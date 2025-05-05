import { OrderItem, OrderItemPrimitives } from "@orders/domain/entitys/order-item.entity";
import { Address, AddressPrimitives } from "@shippings/domain/value-objects/address.vo";
import { ShippingStatus, ShippingStatusEnum } from "@shippings/domain/value-objects/shipping-status.vo";

export interface ShippingPrimitives {
  id: string;
  orderId: string;
  items: OrderItemPrimitives[];
  shippingAddress: AddressPrimitives;
  status: string;
  userId: string;
}

export class Shipping {
  private _id: string;
  private _orderId: string;
  private _items: OrderItem[];
  private _shippingAddress: Address;
  private _status: ShippingStatus;
  private _userId: string;

  constructor(
    id: string,
    orderId: string,
    items: OrderItem[],
    shippingAddress: Address,
    status: ShippingStatus = new ShippingStatus(ShippingStatusEnum.PENDING),
    userId: string,
  ) {
    this._id = id;
    this._orderId = orderId;
    this._items = items;
    this._shippingAddress = shippingAddress;
    this._status = status;
    this._userId = userId;
  }

  get id(): string {
    return this._id;
  }

  get orderId(): string {
    return this._orderId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get shippingAddress(): Address {
    return this._shippingAddress;
  }

  get status(): ShippingStatus {
    return this._status;
  }

  markAsShipped(): void {
    if (!this._status.isPending()) {
      throw new Error(`Cannot ship in status: ${this._status.value}`);
    }
    this._status = new ShippingStatus(ShippingStatusEnum.SHIPPED);
  }

  markAsDelivered(): void {
    if (!this._status.isShipped()) {
      throw new Error(`Cannot mark as delivered in status: ${this._status.value}`);
    }
    this._status = new ShippingStatus(ShippingStatusEnum.DELIVERED);
  }

  static fromPrimitives(data: ShippingPrimitives): Shipping {
    return new Shipping(
      data.id,
      data.orderId,
      data.items.map((item) => OrderItem.fromPrimitives(item)),
      Address.fromPrimitives(data.shippingAddress),
      ShippingStatus.fromString(data.status),
      data.userId,
    );
  }

  toPrimitives(): ShippingPrimitives {
    return {
      id: this._id,
      orderId: this._orderId,
      items: this._items.map((item) => item.toPrimitives()),
      shippingAddress: this._shippingAddress.toPrimitives(),
      status: this._status.value,
      userId: this._userId,
    };
  }
} 