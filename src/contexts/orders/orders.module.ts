import CreateOrderController from '@orders/infraestructure/controllers/create-order.controller';
import { Module } from '@nestjs/common';  
import { OrderRepositoryImpl } from '@orders/infraestructure/adapters/order.repository';
import { ItemRepositoryImpl } from '@items/infraestructure/adapters/items.repository';
import { PaymentGatewayImpl } from '@orders/infraestructure/adapters/payment-gateway.adapter';
import { CreateOrderUseCase } from '@orders/application/create-order.usecase';
import { PrismaService } from '@shared/persistance/prisma.service';
import { ORDER_REPOSITORY } from '@orders/domain/repos/order.repository';
import { PAYMENT_GATEWAY } from '@orders/domain/repos/payment-gateway.port';
import { ITEM_REPOSITORY } from '@items/domain/repos/item.repository';
import { PayOrderUseCase } from '@orders/application/pay-order.usecase';
import { IncreaseItemStockUseCase } from '@items/application/increase-item-stock.usecase';
import { DecreaseItemStockUseCase } from '@items/application/decrease-item-stock.usecase';
import { ListOrdersUseCase } from '@orders/application/list-orders.usecase';
import { ListOrdersController } from '@orders/infraestructure/controllers/list-orders.controller';

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
