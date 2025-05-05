import { Injectable } from '@nestjs/common';
import { ItemRepository } from '@items/domain/repos/item.repository';
import { Item } from '@items/domain/entitys/item.entity';
import { Transaction } from '@shared/persistance/transactions';
import { PrismaService } from '@shared/persistance/prisma.service';
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

  private mapDomainToPrisma(item: Item): PrismaItem {
    return {
      id: item.id,
      name: item.name,
      description: item.description ?? null,
      price: item.price.value,
      stock: item.stock.value,
    };
  }

  async findById(id: string, tx?: Transaction): Promise<Item | null> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;
    const itemData = await prismaClient.item.findUnique({
      where: { id: id },
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

    const createResult = await prismaClient.item.create({
      data: this.mapDomainToPrisma(item),
    });

    return this.mapPrismaItemToDomain(createResult)!;
  }

  async update(item: Item, tx?: Transaction): Promise<Item> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const updateResult = await prismaClient.item.update({
      where: { id: item.id },
      data: this.mapDomainToPrisma(item),
    });

    return this.mapPrismaItemToDomain(updateResult)!;
  }
}
