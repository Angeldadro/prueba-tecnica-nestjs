import { Module } from '@nestjs/common';  
import { OrderRepositoryImpl } from '@orders/infraestructure/adapters/order.repository';
import { ORDER_REPOSITORY } from '@orders/domain/repos/order.repository';
import { ListShippingsUseCase } from './application/list-shippings.usecase';
import { SHIPPING_REPOSITORY } from './domain/repos/shipping.repository';
import { ShippingRepositoryAdapter } from './infraestructure/repos/shipping.repository';
import { UpdateShippingStatusUseCase } from './application/update-shipping-status.usecase';
import { PrismaService } from '@shared/persistance/prisma.service';
import ListShippingsController from './infraestructure/controllers/list-shippings.controller';
@Module({
  controllers: [ListShippingsController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepositoryImpl,
    },
   
    {
      provide: SHIPPING_REPOSITORY,
      useClass: ShippingRepositoryAdapter,
    },
    PrismaService,
    ListShippingsUseCase,
    UpdateShippingStatusUseCase,
  ],
  exports: [],
})
export class ShippingsModule {}
