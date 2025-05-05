import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from '@orders/infraestructure/dtos/create-order.dto';
import { OrderProcessorService } from '@orders/infraestructure/services/order-processor.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('orders')
@Controller('orders')
export class CreateOrderController {
  constructor(private readonly orderProcessorService: OrderProcessorService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async execute(@Body() command: CreateOrderDto, @Req() req: any): Promise<string> {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const result = await this.orderProcessorService.processOrder(command, userId, userEmail);
    if (!result.isSuccess) {
      throw result.error;
    }
    return result.value;
  }
}
