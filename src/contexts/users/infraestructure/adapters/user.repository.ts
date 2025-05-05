import { Injectable } from '@nestjs/common';
import { UserRepository } from '@users/domain/repos/user.repository';
import { User, UserData } from '@users/domain/entitys/user.entity';
import { Transaction } from '@shared/persistance/transactions';
import { PrismaService } from '@shared/persistance/prisma.service';
import { PrismaClient } from '@prisma/client';
import { UserRole, UserRoleEnum } from '@users/domain/value-objects/user-role.vo';

@Injectable()
export class UserRepositoryAdapter implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapPrismaUserToDomain(user: any): User {
    return User.fromPrimitives({
      id: user.id,
      email: user.email,
      password: user.password,
      role: UserRole.create(user.role as UserRoleEnum),
      createdAt: user.createdAt
    });
  }

  async create(user: User, tx?: Transaction): Promise<User> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const created = await client.user.create({
        data: {
          id: user.getId(),
          email: user.getEmail(),
          password: user.getPassword(),
          role: user.getRole().getValue(),
          createdAt: user.getCreatedAt(),
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string, tx?: Transaction): Promise<User | null> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const found = await client.user.findUnique({
        where: { id },
      });

      if (!found) return null;
      return this.mapPrismaUserToDomain(found);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string, tx?: Transaction): Promise<User | null> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const found = await client.user.findUnique({
        where: { email },
      });

      if (!found) return null;
      return this.mapPrismaUserToDomain(found);
    } catch (error) {
      throw error;
    }
  }

  async update(user: User, tx?: Transaction): Promise<User> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const updated = await client.user.update({
        where: { id: user.getId() },
        data: {
          email: user.getEmail(),
          password: user.getPassword(),
          role: user.getRole().getValue(),
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
} 