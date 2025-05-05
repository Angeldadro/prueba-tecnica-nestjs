import { CreateOrderController } from '@orders/infraestructure/controllers/create-order.controller';
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
import { OrderProcessorService } from '@orders/infraestructure/services/order-processor.service';
import { CreateShippingUseCase } from '@shippings/application/create-shipping.usecase';
import { SHIPPING_REPOSITORY } from '../shippings/domain/repos/shipping.repository';
import { ShippingRepositoryAdapter } from '@shippings/infraestructure/repos/shipping.repository';
import { ItemsModule } from '@items/items.module';

@Module({
  imports: [ItemsModule],
  controllers: [CreateOrderController, ListOrdersController],
  providers: [
    PrismaService,
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
    {
      provide: SHIPPING_REPOSITORY,
      useClass: ShippingRepositoryAdapter,
    },
    PayOrderUseCase,
    IncreaseItemStockUseCase,
    DecreaseItemStockUseCase,
    CreateOrderUseCase,
    ListOrdersUseCase,
    OrderProcessorService,
    CreateShippingUseCase,
  ],
  exports: [],
})
export class OrdersModule {}
