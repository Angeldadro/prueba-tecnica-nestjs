import CreateOrderController from '../infrastructure/controllers/create-order.controller';
import { Module } from '@nestjs/common';
import { OrderRepositoryImpl } from '../infrastructure/adapters/order.repository';
import { ItemRepositoryImpl } from '../infrastructure/adapters/items.repository';
import { PaymentGatewayImpl } from '../infrastructure/adapters/payment-gateway.adapter';
import { CreateOrderUseCase } from '../application/create-order.usecase';
import { PrismaService } from '../infrastructure/persistance/prisma.service';
import { ORDER_REPOSITORY } from '../domain/repos/order.repository';
import { PAYMENT_GATEWAY } from '../domain/repos/payment-gateway.port';
import { ITEM_REPOSITORY } from '../domain/repos/item.repository';
import { PayOrderUseCase } from '../application/pay-order.usecase';
import { IncreaseItemStockUseCase } from '../application/increase-item-stock.usecase';
import { DecreaseItemStockUseCase } from '../application/decrease-item-stock.usecase';
import { ListOrdersUseCase } from '../application/list-orders.usecase';
import { ListOrdersController } from '../infrastructure/controllers/list-orders.controller';

@Module({
  controllers: [CreateOrderController, ListOrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: ITEM_REPOSITORY,
      useClass: ItemRepositoryImpl,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: PaymentGatewayImpl,
    },
    PayOrderUseCase,
    IncreaseItemStockUseCase,
    DecreaseItemStockUseCase,
    CreateOrderUseCase,
    ListOrdersUseCase,
    PrismaService,
  ],
  exports: [PrismaService],
})
export class OrdersModule {}
