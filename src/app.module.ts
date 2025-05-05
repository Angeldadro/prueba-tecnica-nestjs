import { Module } from '@nestjs/common';
import { ItemsModule } from '@items/items.module';
import { OrdersModule } from '@orders/orders.module';
import { ShippingsModule } from '@shippings/shippings.module';  
import { AuthModule } from '@users/auth.module';
@Module({
  imports: [ItemsModule, OrdersModule, ShippingsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
