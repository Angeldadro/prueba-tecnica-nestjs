import { Inject, Injectable } from '@nestjs/common';
import { failure, Result, success } from '@shared/ROP/result';
import { Order } from '@orders/domain/entitys/order.entity';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '@orders/domain/repos/order.repository';

@Injectable()
export class ListUserOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(userId: string): Promise<Result<Order[], Error>> {
    try {
      const orders = await this.orderRepository.findByUserId(userId);
      return success(orders);
    } catch (error) {
      return failure(error as Error);
    }
  }
} 