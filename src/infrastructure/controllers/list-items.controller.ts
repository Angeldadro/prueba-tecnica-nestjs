import { ListItemsUseCase } from '@/src/application/list-items.usecase';
import { Controller, Get, BadRequestException } from '@nestjs/common';
import { ItemDto } from '../dtos/item.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('items')
class ListItemsController {
  constructor(private readonly listItemsUseCase: ListItemsUseCase) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of items',
    type: [ItemDto],
  })
  async execute(): Promise<ItemDto[]> {
    const result = await this.listItemsUseCase.execute();

    if (!result.isSuccess) {
      throw new BadRequestException(result.error.message);
    }

    const items = result.value;
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.value,
      stock: item.stock.value,
    }));
  }
}

export default ListItemsController;
