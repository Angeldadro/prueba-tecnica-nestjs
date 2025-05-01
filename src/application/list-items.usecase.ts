import { Inject, Injectable } from '@nestjs/common';
import { Item } from '@/domain/entitys/item.entity';
import {
  ITEM_REPOSITORY,
  ItemRepository,
} from '@/domain/repos/item.repository';

import { Result, success, failure } from '../shared/result';

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
      return failure(err as Error);
    }
  }
}
