import { CreateOrderUseCase } from '@orders/application/create-order.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from '@orders/infraestructure/dtos/create-order.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { OrderDto } from '@orders/infraestructure/dtos/order.dto';
import { PrismaService } from '@shared/persistance/prisma.service';
import { PayOrderUseCase } from '@orders/application/pay-order.usecase';
import { DecreaseItemStockUseCase } from '@items/application/decrease-item-stock.usecase';
import { IncreaseItemStockUseCase } from '@items/application/increase-item-stock.usecase';

@Controller('orders')
class CreateOrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly decreaseItemStockUseCase: DecreaseItemStockUseCase,
    private readonly increaseItemStockUseCase: IncreaseItemStockUseCase,
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
          const result = await this.increaseItemStockUseCase.execute(
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
