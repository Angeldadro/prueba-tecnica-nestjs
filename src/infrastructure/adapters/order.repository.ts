import { Injectable } from '@nestjs/common';
import { OrderRepository } from '@/domain/repos/order.repository';
import { Order } from '@/domain/entitys/order.entity';
import { Transaction } from '@/domain/repos/transactions';
import { PrismaService } from '@/src/infrastructure/persistance/prisma.service';
import {
  PrismaClient,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '@prisma/client';
type OrderWithItems = PrismaOrder & { orderItems: PrismaOrderItem[] };

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapPrismaOrderToDomain(
    orderData: OrderWithItems | null,
  ): Order | null {
    if (!orderData) return null;

    return Order.fromPrimitives({
      id: orderData.id,
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      orderItems: orderData.orderItems.map((oi) => ({
        id: oi.id,
        itemId: oi.itemId,
        quantity: oi.quantity,
        priceAtOrder: oi.priceAtOrder,
      })),
      paymentGatewayRef: orderData.paymentGatewayRef ?? undefined,
      createdAt: orderData.createdAt,
    });
  }

  async findById(id: string, tx?: Transaction): Promise<Order | null> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const orderData = await prismaClient.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    return this.mapPrismaOrderToDomain(orderData);
  }

  async findAll(tx?: Transaction): Promise<Order[]> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const ordersData = await prismaClient.order.findMany({
      include: { orderItems: true },
    });

    return ordersData.map(
      (orderData) => this.mapPrismaOrderToDomain(orderData)!,
    );
  }

  async save(order: Order, tx?: Transaction): Promise<Order> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const orderPrimitives = order.toPrimitives();

    const createResult = await prismaClient.order.create({
      data: {
        id: orderPrimitives.id,
        status: orderPrimitives.status,
        totalAmount: orderPrimitives.totalAmount,
        paymentGatewayRef: orderPrimitives.paymentGatewayRef,
        createdAt: orderPrimitives.createdAt,
      },
      include: { orderItems: true },
    });

    const orderItems = orderPrimitives.orderItems.map((oi) => {
      return {
        id: oi.id,
        orderId: order.id,

        itemId: oi.itemId,
        quantity: oi.quantity,
        priceAtOrder: oi.priceAtOrder,
      };
    });
    await prismaClient.orderItem.createMany({
      data: orderItems,
    });

    return this.mapPrismaOrderToDomain(createResult)!;
  }

  async update(order: Order, tx?: Transaction): Promise<Order> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const orderPrimitives = order.toPrimitives();

    const updateResult = await prismaClient.order.update({
      where: { id: order.id },
      data: {
        status: orderPrimitives.status,
        paymentGatewayRef: orderPrimitives.paymentGatewayRef,
      },
      include: { orderItems: true },
    });

    return this.mapPrismaOrderToDomain(updateResult)!;
  }
}
