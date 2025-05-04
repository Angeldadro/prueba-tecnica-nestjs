import { Injectable } from '@nestjs/common';
import { OrderRepository } from '@orders/domain/repos/order.repository';
import { Order, OrderItem as OrderItemPrimitives } from '@orders/domain/entitys/order.entity';
import { Transaction } from '@shared/persistance/transactions';
import { PrismaService } from '@shared/persistance/prisma.service';
import {
  OrderItem,
  PrismaClient,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '@prisma/client';
type OrderWithItems = PrismaOrder & { orderItems: PrismaOrderItem[] };

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapPrismaOrderToDomain(
    orderData: OrderWithItems,
  ): Order {
    return Order.fromPrimitives({
      id: orderData.id,
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      orderItems: orderData.orderItems.map((oi) => this.mapPrismaOrderItemToDomain(oi)),
      paymentGatewayRef: orderData.paymentGatewayRef ?? undefined,
      createdAt: orderData.createdAt,
    });
  }
  private mapPrismaOrderItemToDomain(orderItem: PrismaOrderItem): OrderItem {
    return {
      id: orderItem.id,
      itemId: orderItem.itemId,
      quantity: orderItem.quantity, 
      priceAtOrder: orderItem.priceAtOrder,
      orderId: orderItem.orderId,
    };
  }
  private mapDomainToPrismaOrder(order: Order): PrismaOrder {
    return {
      id: order.id,
      status: order.status.value,
      totalAmount: order.totalAmount,
      paymentGatewayRef: order.paymentGatewayRef ?? null,
      createdAt: order.createdAt,
    };
  }
  

  private mapDomainToPrismaOrderItem(orderItem: OrderItemPrimitives, orderId: string): PrismaOrderItem {
    return {
      id: orderItem.id,
      orderId: orderId,
      itemId: orderItem.itemId,
      quantity: orderItem.quantity,
      priceAtOrder: orderItem.priceAtOrder,
    };
  }

  async findById(id: string, tx?: Transaction): Promise<Order | null> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const orderData = await prismaClient.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!orderData) return null;
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

    const createResult = await prismaClient.order.create({
      data: this.mapDomainToPrismaOrder(order),
      include: { orderItems: true },
    });

    await prismaClient.orderItem.createMany({
      data: order.orderItems.map(item => this.mapDomainToPrismaOrderItem(item, createResult.id)),
    });

    return this.mapPrismaOrderToDomain(createResult)!;
  }

  async update(order: Order, tx?: Transaction): Promise<Order> {
    const prismaClient = tx ? (tx as PrismaClient) : this.prisma;

    const updateResult = await prismaClient.order.update({
      where: { id: order.id },
      data: this.mapDomainToPrismaOrder(order),
      include: { orderItems: true },
    });

    return this.mapPrismaOrderToDomain(updateResult)!;
  }
}
