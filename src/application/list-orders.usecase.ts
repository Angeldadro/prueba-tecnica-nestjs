import { Inject, Injectable } from '@nestjs/common';
import { failure, Result, success } from '../shared/result';
import { Order } from '../domain/entitys/order.entity';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../domain/repos/order.repository';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}
  async execute(): Promise<Result<Order[], Error>> {
    const orders = await this.orderRepository.findAll();
    if (orders) {
      return success(orders);
    } else {
      return failure(new Error('No se pudo obtener los pedidos'));
    }
  }
}
