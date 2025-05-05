import { Shipping } from '@shippings/domain/entitys/shipping.entity';
import { Transaction } from '@shared/persistance/transactions';

export interface ShippingRepository {
  create(shipping: Shipping, tx?: Transaction): Promise<Shipping>;
  findById(id: string, tx?: Transaction): Promise<Shipping | null>;
  findByOrderId(orderId: string, tx?: Transaction): Promise<Shipping | null>;
  update(shipping: Shipping, tx?: Transaction): Promise<Shipping>;
  findAll(tx?: Transaction): Promise<Shipping[]>;
  findByUserId(userId: string, tx?: Transaction): Promise<Shipping[]>;
}

export const SHIPPING_REPOSITORY = Symbol('ShippingRepository'); 