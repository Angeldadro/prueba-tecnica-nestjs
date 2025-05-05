export enum ShippingStatusEnum {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export class ShippingStatus {
  constructor(private readonly _value: ShippingStatusEnum) {}

  get value(): ShippingStatusEnum {
    return this._value;
  }

  isPending(): boolean {
    return this._value === ShippingStatusEnum.PENDING;
  }

  isShipped(): boolean {
    return this._value === ShippingStatusEnum.SHIPPED;
  }

  isDelivered(): boolean {
    return this._value === ShippingStatusEnum.DELIVERED;
  }

  static fromString(value: string): ShippingStatus {
    if (!Object.values(ShippingStatusEnum).includes(value as ShippingStatusEnum)) {
      throw new Error(`Invalid shipping status: ${value}`);
    }
    return new ShippingStatus(value as ShippingStatusEnum);
  }
} 