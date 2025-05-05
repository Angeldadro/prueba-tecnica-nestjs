import { Inject, Injectable } from '@nestjs/common';
import {
  ItemRepository,
  ITEM_REPOSITORY,
} from '@items/domain/repos/item.repository';
import { Transaction } from '@shared/persistance/transactions';
import { Item } from '@items/domain/entitys/item.entity';
import { NotFoundException as ItemNotFoundException } from '@nestjs/common';
import { failure, Result, success } from '@shared/ROP/result';

interface DecreaseItemStockCommand {
  id: string;
  quantity: number;
}

@Injectable()
export class DecreaseItemStockUseCase {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(
    command: DecreaseItemStockCommand,
    tx?: Transaction,
  ): Promise<Result<Item, Error>> {
    const item = await this.itemRepository.findById(command.id, tx);
    if (!item) {
      return failure(new ItemNotFoundException(command.id));
    }

    try {
      item.decreaseStock(command.quantity);
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
