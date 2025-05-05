import { Controller, Get } from '@nestjs/common';
import { ListOrdersUseCase } from '@orders/application/list-orders.usecase';
import { OrderDto } from '@orders/infraestructure/dtos/order.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Order } from '@orders/domain/entitys/order.entity';

@Controller('orders')
@ApiResponse({ status: 200, description: 'Order created', type: OrderDto })
export class ListOrdersController {
  constructor(private readonly listOrdersUseCase: ListOrdersUseCase) {}

  @Get()
  async listOrders(): Promise<OrderDto[]> {
    const orders = await this.listOrdersUseCase.execute();
    if (orders.isSuccess) {
      return orders.value.map((order) => this.parseOrder(order));
    } else {
      throw orders.error;
    }
  }

  private parseOrder(order: Order): OrderDto {
    const orderPrimitives = order.toPrimitives();
    return {
      id: orderPrimitives.id,
      status: orderPrimitives.status,
      totalAmount: orderPrimitives.totalAmount,
      orderItems: orderPrimitives.orderItems,
      paymentGatewayRef: orderPrimitives.paymentGatewayRef,
      createdAt: orderPrimitives.createdAt,
    };
  }
}
