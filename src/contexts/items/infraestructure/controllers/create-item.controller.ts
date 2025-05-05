import { CreateItemUseCase } from '@items/application/create-item.usecase';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateItemDto } from '@items/infraestructure/dtos/create-item.dto';
import { ItemDto } from '@items/infraestructure/dtos/item.dto';
import { NotFoundException as ItemAlreadyExistsException } from '@nestjs/common';

@Controller('items')
class CreateItemController {
  private createItemUseCase: CreateItemUseCase;
  constructor(createItemUseCase: CreateItemUseCase) {
    this.createItemUseCase = createItemUseCase;
  }
  @Post()
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({ status: 201, description: 'Item created', type: ItemDto })
  async execute(@Body() command: CreateItemDto): Promise<ItemDto> {
    const result = await this.createItemUseCase.execute(command);
    if (!result.isSuccess) {
      const error = result.error;
      if (error instanceof ItemAlreadyExistsException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }

    const item = result.value;
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.value,
      stock: item.stock.value,
    };
  }
}
export default CreateItemController;
