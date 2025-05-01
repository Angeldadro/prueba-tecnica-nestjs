import { CreateItemUseCase } from '@/src/application/create-item.usecase';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateItemDto } from '../dtos/create-item.dto';
import { ItemDto } from '../dtos/item.dto';
import { ItemAlreadyExistsException } from '@/src/domain/errors/item-already-exists.error';

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
