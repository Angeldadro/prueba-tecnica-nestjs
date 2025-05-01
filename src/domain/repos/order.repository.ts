import { Order } from '@/domain/entitys/order.entity';
import { Transaction } from '@/domain/repos/transactions';

export interface OrderRepository {
  findById(id: string, tx?: Transaction): Promise<Order | null>;
  save(order: Order, tx?: Transaction): Promise<Order>;
  findAll(tx?: Transaction): Promise<Order[]>;
  update(order: Order, tx?: Transaction): Promise<Order>;
}
export const ORDER_REPOSITORY = Symbol('OrderRepository');
