export enum OrderStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class OrderStatus {
  private readonly _value: OrderStatusEnum;

  constructor(value: OrderStatusEnum) {
    if (!Object.values(OrderStatusEnum).includes(value)) {
      throw new Error('Invalid order status.');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  public isPending(): boolean {
    return this._value === OrderStatusEnum.PENDING;
  }

  public isApproved(): boolean {
    return this._value === OrderStatusEnum.APPROVED;
  }

  public isRejected(): boolean {
    return this._value === OrderStatusEnum.REJECTED;
  }
  static fromString(value: string): OrderStatus {
    return new OrderStatus(value as OrderStatusEnum);
  }

}
