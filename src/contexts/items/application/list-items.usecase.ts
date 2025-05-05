import { Inject, Injectable } from '@nestjs/common';
import { Item } from '@items/domain/entitys/item.entity';
import {
  ITEM_REPOSITORY,
  ItemRepository,
} from '@items/domain/repos/item.repository';

import { Result, success, failure } from '@shared/ROP/result';

@Injectable()
export class ListItemsUseCase {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(): Promise<Result<Item[], Error>> {
    try {
      const items = await this.itemRepository.findAll();
      return success(items);
    } catch (err) {
      return failure(err);
    }
  }
}
