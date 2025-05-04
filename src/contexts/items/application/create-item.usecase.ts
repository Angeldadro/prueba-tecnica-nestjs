import { Inject, Injectable } from '@nestjs/common';
import { Item } from '@items/domain/entitys/item.entity';
import {
  ITEM_REPOSITORY,
  ItemRepository,
} from '@items/domain/repos/item.repository';
import { ItemAlreadyExistsException } from '@items/domain/errors/item-already-exists.error';
import { failure, Result, success } from '@shared/ROP/result';

interface CreateItemCommand {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

@Injectable()
export class CreateItemUseCase {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(command: CreateItemCommand): Promise<Result<Item, Error>> {
    const exists = await this.itemRepository.findById(command.id);
    if (exists) {
      return failure(new ItemAlreadyExistsException(command.id));
    }

    const newItem = new Item(
      command.name,
      command.price,
      command.stock,
      command.id,
      command.description,
    );

    try {
      const savedItem = await this.itemRepository.save(newItem);
      return success(savedItem);
    } catch (err) {
      return failure(err as Error); // o algún error general
    }
  }
}
