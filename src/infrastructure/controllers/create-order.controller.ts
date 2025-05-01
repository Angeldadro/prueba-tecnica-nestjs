import { CreateOrderUseCase } from '@/src/application/create-order.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { OrderDto } from '../dtos/order.dto';
import { PrismaService } from '../persistance/prisma.service';
import { PayOrderUseCase } from '@/src/application/pay-order.usecase';
import { DecreaseItemStockUseCase } from '@/src/application/decrease-item-stock.usecase';

@Controller('orders')
class CreateOrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly decreaseItemStockUseCase: DecreaseItemStockUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created', type: OrderDto })
  async execute(@Body() command: CreateOrderDto): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const item of command.items) {
        const result = await this.decreaseItemStockUseCase.execute(
          { id: item.itemId, quantity: item.quantity },
          tx,
        );
        if (!result.isSuccess) {
          throw result.error;
        }
      }
    });
    try {
      await this.prisma.$transaction(async (tx) => {
        const result = await this.createOrderUseCase.execute(command, tx);
        if (!result.isSuccess) {
          throw result.error;
        }
      });

      await this.prisma.$transaction(
        async (tx) => {
          const result = await this.payOrderUseCase.execute(command, tx);

          if (!result.isSuccess) {
            throw result.error;
          }
        },
        { timeout: 20000 },
      );
    } catch (err) {
      await this.prisma.$transaction(async (tx) => {
        for (const item of command.items) {
          const result = await this.decreaseItemStockUseCase.execute(
            { id: item.itemId, quantity: item.quantity },
            tx,
          );
          if (!result.isSuccess) {
            throw result.error;
          }
        }
      });

      throw err;
    }
  }
}

export default CreateOrderController;
