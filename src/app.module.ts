import { Module } from '@nestjs/common';
import { ItemsModule } from '@items/items.module';
import { OrdersModule } from '@orders/orders.module';

@Module({
  imports: [ItemsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
