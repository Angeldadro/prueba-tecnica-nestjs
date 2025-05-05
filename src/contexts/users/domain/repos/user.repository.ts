import { User } from '@users/domain/entitys/user.entity';
import { Transaction } from '@shared/persistance/transactions';

export interface UserRepository {
  create(user: User, tx?: Transaction): Promise<User>;
  findById(id: string, tx?: Transaction): Promise<User | null>;
  findByEmail(email: string, tx?: Transaction): Promise<User | null>;
  update(user: User, tx?: Transaction): Promise<User>;
}

export const USER_REPOSITORY = Symbol('UserRepository'); 