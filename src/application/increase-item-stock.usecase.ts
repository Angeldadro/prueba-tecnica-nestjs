import { Inject, Injectable } from '@nestjs/common';
import {
  ItemRepository,
  ITEM_REPOSITORY,
} from '@/domain/repos/item.repository';
import { Transaction } from '../domain/repos/transactions';
import { Item } from '../domain/entitys/item.entity';
import { ItemNotFoundException } from '../domain/errors/item-not-found.error';

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
  ): Promise<Item> {
    const item = await this.itemRepository.findById(command.id, tx);
    if (!item) {
      throw new ItemNotFoundException(command.id);
    }
    item.increaseStock(command.quantity);
    return await this.itemRepository.update(item);
  }
}
