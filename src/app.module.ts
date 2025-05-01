import { Module } from '@nestjs/common';
import { ItemsModule } from '@/src/items/items.module';
import { OrdersModule } from '@/src/orders/orders.module';

@Module({
  imports: [ItemsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
