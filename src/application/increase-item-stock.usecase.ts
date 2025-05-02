import { Inject, Injectable } from '@nestjs/common';
import {
  ItemRepository,
  ITEM_REPOSITORY,
} from '@/domain/repos/item.repository';
import { Transaction } from '../domain/repos/transactions';
import { Item } from '../domain/entitys/item.entity';
import { ItemNotFoundException } from '../domain/errors/item-not-found.error';
import { failure, Result, success } from '../shared/result';

interface IncreaseItemStockCommand {
  id: string;
  quantity: number;
}

@Injectable()
export class IncreaseItemStockUseCase {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(
    command: IncreaseItemStockCommand,
    tx?: Transaction,
  ): Promise<Result<Item, Error>> {
    const item = await this.itemRepository.findById(command.id, tx);
    if (!item) {
      return failure(new ItemNotFoundException(command.id));
    }

    try {
      item.increaseStock(command.quantity);
    } catch (err) {
      return failure(err as Error);
    }

    try {
      const updatedItem = await this.itemRepository.update(item);
      return success(updatedItem);
    } catch (err) {
      return failure(err as Error);
    }
  }
}
