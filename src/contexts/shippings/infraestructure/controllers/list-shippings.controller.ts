import { Controller, Get } from '@nestjs/common';
import { ListShippingsUseCase } from '@shippings/application/list-shippings.usecase';
import { ApiResponse } from '@nestjs/swagger';
import { ShippingDto } from '../dtos/shipping.dto';

@Controller('shippings')
class ListShippingsController {
  constructor(private readonly listShippingsUseCase: ListShippingsUseCase) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of shippings', type: [ShippingDto] })
  async execute(): Promise<ShippingDto[]> {
    const result = await this.listShippingsUseCase.execute();
    if (!result.isSuccess) {
      throw result.error;
    }
    return result.value.map((shipping) => shipping.toPrimitives());
  }
}

export default ListShippingsController; 