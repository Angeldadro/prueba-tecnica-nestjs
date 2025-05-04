import { Item } from '@items/domain/entitys/item.entity';
import { Transaction } from '@shared/persistance/transactions';

export interface ItemRepository {
  findById(id: string, tx?: Transaction): Promise<Item | null>;
  findWithIdIn(ids: string[], tx?: Transaction): Promise<Item[]>;
  findAll(tx?: Transaction): Promise<Item[]>;
  save(item: Item, tx?: Transaction): Promise<Item>;
  update(item: Item, tx?: Transaction): Promise<Item>;
}
export const ITEM_REPOSITORY = Symbol('ItemRepository');
