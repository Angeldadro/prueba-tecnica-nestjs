import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListUserOrdersUseCase } from '../../application/list-user-orders.usecase';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('orders')
@Controller('orders')
export class ListUserOrdersController {
  constructor(private readonly listUserOrdersUseCase: ListUserOrdersUseCase) {}

  @Get('my-orders')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get authenticated user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async execute(@Req() req: any) {
    const result = await this.listUserOrdersUseCase.execute(req.user.id);
    if (!result.isSuccess) {
      throw new Error(result.error.message);
    }
    return result.value;
  }
} 