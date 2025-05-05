import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListUserShippingsUseCase } from '../../application/list-user-shippings.usecase';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('shippings')
@Controller('shippings')
export class ListUserShippingsController {
  constructor(private readonly listUserShippingsUseCase: ListUserShippingsUseCase) {}

  @Get('my-shippings')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get authenticated user shippings' })
  @ApiResponse({ status: 200, description: 'Shippings retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async execute(@Req() req: any) {
    const result = await this.listUserShippingsUseCase.execute(req.user.id);
    if (!result.isSuccess) {
      throw new Error(result.error.message);
    }
    return result.value;
  }
} 