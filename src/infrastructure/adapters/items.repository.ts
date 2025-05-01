import { Injectable } from '@nestjs/common';
import { ItemRepository } from '@/domain/repos/item.repository';
import { Item } from '@/domain/entitys/item.entity';
import { Transaction } from '@/domain/repos/transactions';
import { PrismaService } from '../persistance/prisma.service';
import { PrismaClient, Item as PrismaItem } from '@prisma/client';

@Injectable()
export class ItemRepositoryImpl implements ItemRepository {
  constructor(private readonly prisma: PrismaService) {}
  private mapPrismaItemToDomain(itemData: PrismaItem | null): Item | null {
    if (!itemData) return null;

    return Item.fromPrimitives({
      id: itemData.id,
      name: itemData.name,
      description: itemData.description ?? undefined,
      price: itemData.price,
      stock: itemData.stock,
    });
  }
  async findById(id: string, tx?: Transaction): Promise<Item | null> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;
    const itemData = await prismaClient.item.findUnique({
      where: { id },
    });

    return this.mapPrismaItemToDomain(itemData);
  }

  async findWithIdIn(ids: string[], tx?: Transaction): Promise<Item[]> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;
    const itemData = await prismaClient.item.findMany({
      where: { id: { in: ids } },
    });
    return itemData.map((item) => this.mapPrismaItemToDomain(item)!);
  }

  async findAll(tx?: Transaction): Promise<Item[]> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;
    const itemData = await prismaClient.item.findMany();
    return itemData.map((item) => this.mapPrismaItemToDomain(item)!);
  }

  async save(item: Item, tx?: Transaction): Promise<Item> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const itemPrimitives = item.toPrimitives();

    const createResult = await prismaClient.item.create({
      data: {
        id: itemPrimitives.id,
        name: itemPrimitives.name,
        description: itemPrimitives.description,
        price: itemPrimitives.price,
        stock: itemPrimitives.stock,
      },
    });

    return this.mapPrismaItemToDomain(createResult)!;
  }

  async update(item: Item, tx?: Transaction): Promise<Item> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const itemPrimitives = item.toPrimitives();
    const updateResult = await prismaClient.item.update({
      where: { id: item.id },
      data: {
        name: itemPrimitives.name,
        description: itemPrimitives.description,
        price: itemPrimitives.price,
        stock: itemPrimitives.stock,
      },
    });

    return this.mapPrismaItemToDomain(updateResult)!;
  }
}
