import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/persistance/prisma.service';
import { ShippingRepository } from '@shippings/domain/repos/shipping.repository';
import { Shipping, ShippingPrimitives } from '@shippings/domain/entitys/shipping.entity';
import { Transaction } from '@shared/persistance/transactions';
import { PrismaClient, Shipping as PrismaShipping, ShippingItem as PrismaShippingItem } from '@prisma/client';
import { OrderItem } from '@/src/contexts/orders/domain/entitys/order-item.entity';
import { OrderItemPrimitives } from '@/src/contexts/orders/domain/entitys/order-item.entity';

@Injectable()
export class ShippingRepositoryAdapter implements ShippingRepository {
  constructor(private readonly prisma: PrismaService) { }

  private mapPrismaShippingToDomain(shipping: PrismaShipping & { shippingItems: PrismaShippingItem[] }): Shipping {
    return Shipping.fromPrimitives(
      {
        id: shipping.id,
        orderId: shipping.orderId,
        status: shipping.status,
        userId: shipping.userId,
        items: shipping.shippingItems.map((item) => this.mapPrismaShippingItemToDomain(item)),
        shippingAddress: {
          street: shipping.street,
          city: shipping.city,
          state: shipping.state,
          zipCode: shipping.zipCode,
          country: shipping.country,
        },
      }
    );
  }

  private mapPrismaShippingItemToDomain(item: OrderItemPrimitives): OrderItem {
    return OrderItem.fromPrimitives({
      id: item.id,
      itemId: item.itemId,
      quantity: item.quantity,
      priceAtOrder: item.priceAtOrder,
    });
  }

  private mapShippingPrimitivesToPrisma(shipping: ShippingPrimitives): PrismaShipping {
    return {
      id: shipping.id,
      orderId: shipping.orderId,
      status: shipping.status,
      street: shipping.shippingAddress.street,
      city: shipping.shippingAddress.city,
      state: shipping.shippingAddress.state,
      zipCode: shipping.shippingAddress.zipCode,
      country: shipping.shippingAddress.country,
      userId: shipping.userId,
    };
  }

  private mapShippingItemPrimitivesToPrisma(item: OrderItemPrimitives, shippingId: string): PrismaShippingItem {
    return {
      id: item.id,
      shippingId: shippingId,
      itemId: item.itemId,
      quantity: item.quantity,
      priceAtOrder: item.priceAtOrder,
    };
  }
  async create(shipping: Shipping, tx?: Transaction): Promise<Shipping> {
    const client = tx as PrismaClient || this.prisma;

    const shippingPrimitives = shipping.toPrimitives();
    try {
      const created = await client.shipping.create({
        data: this.mapShippingPrimitivesToPrisma(shippingPrimitives),
        include: {
          shippingItems: true,
        },
      });

      await client.shippingItem.createMany({
        data: shippingPrimitives.items.map((item) => this.mapShippingItemPrimitivesToPrisma(item, created.id)),
      });

      return this.mapPrismaShippingToDomain(created);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string, tx?: Transaction): Promise<Shipping | null> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const found = await client.shipping.findUnique({
        where: { id },
        include: {
          shippingItems: true,
        },
      });

      if (!found) return null;
      return this.mapPrismaShippingToDomain(found);
    } catch (error) {
      throw error;
    }
  }

  async findByOrderId(orderId: string, tx?: Transaction): Promise<Shipping | null> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const found = await client.shipping.findUnique({
        where: { orderId },
        include: {
          shippingItems: true,
        },
      });

      if (!found) return null;
      return this.mapPrismaShippingToDomain(found);
    } catch (error) {
      throw error;
    }
  }

  async update(shipping: Shipping, tx?: Transaction): Promise<Shipping> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const updated = await client.shipping.update({
        where: { id: shipping.id },
        data: {
          status: shipping.status.value,
        },
        include: {
          shippingItems: true,
        },
      });

      return this.mapPrismaShippingToDomain(updated);
    } catch (error) {
      throw error;
    }
  }

  async findAll(tx?: Transaction): Promise<Shipping[]> {
    const client = tx as PrismaClient || this.prisma;
    try {
      const shippings = await client.shipping.findMany({
        include: {
          shippingItems: true,
        },
      });

      return shippings.map((shipping) =>
        this.mapPrismaShippingToDomain(shipping)
      );
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string, tx?: Transaction): Promise<Shipping[]> {
    const client = tx as PrismaClient || this.prisma;
    const shippings = await client.shipping.findMany({
      where: { order: { userId } },
      include: {
        shippingItems: true,
      },
    });
    return shippings.map((shipping) =>
      this.mapPrismaShippingToDomain(shipping)
    );
  }
} 
