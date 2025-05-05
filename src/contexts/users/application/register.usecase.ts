import { Injectable } from '@nestjs/common';
import { failure, success, Result } from '@shared/ROP/result';
import { UserRepository } from '@users/domain/repos/user.repository';
import { USER_REPOSITORY } from '@users/domain/repos/user.repository';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@users/domain/entitys/user.entity';
import { UserRole, UserRoleEnum } from '@users/domain/value-objects/user-role.vo';
import { Transaction } from '@shared/persistance/transactions';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string, tx?: Transaction): Promise<Result<User, Error>> {
    try {
      const existingUser = await this.userRepository.findByEmail(email, tx);
      if (existingUser) {
        return failure(new Error('Email already exists'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
        role: UserRole.create(UserRoleEnum.CUSTOMER),
      });

      const createdUser = await this.userRepository.create(user, tx);
      return success(createdUser);
    } catch (error) {
      return failure(error);
    }
  }
} 