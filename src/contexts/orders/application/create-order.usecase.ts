import { Inject, Injectable } from '@nestjs/common';
import {
  ITEM_REPOSITORY,
  ItemRepository,
} from '@items/domain/repos/item.repository';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '@orders/domain/repos/order.repository';
import { NotFoundException as ItemNotFoundException } from '@nestjs/common';
import { Order } from '@orders/domain/entitys/order.entity';
import { OrderItem } from '@orders/domain/entitys/order-item.entity';
import { Item } from '@items/domain/entitys/item.entity';
import { Transaction } from '@shared/persistance/transactions';
import { OrderAlreadyExistsException } from '@orders/domain/errors/order-already-exists.error';

import { Result, success, failure } from '@shared/ROP/result';
import {
  OrderStatus,
  OrderStatusEnum,
} from '@orders/domain/value-objects/order-status.vo';

interface OrderItemCommand {
  id: string;
  itemId: string;
  quantity: number;
}

interface CreateOrderCommand {
  id: string;
  userId: string;
  acceptanceToken: string;
  userEmail: string;
  items: OrderItemCommand[];
}

@Injectable()
export class CreateOrderUseCase  {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: ItemRepository,
  ) { }

  async execute(command: CreateOrderCommand, tx?: Transaction): Promise<Result<Order, Error>> {
    const exist = await this.orderRepository.findById(command.id, tx);
    if (exist) return failure(new OrderAlreadyExistsException(command.id));

    try {
      const itemCommands = this.filterNullishCommandItems(command.items);

      if (itemCommands.length === 0) return failure(new Error('No valid items provided'));

      const items = await this.getItems(itemCommands, tx);
      const orderItems = this.processOrderItems(itemCommands, items);
      const totalAmount = this.getTotalAmount(orderItems);
      const order = this.createOrderEntity(command.id, command.userId, orderItems, totalAmount);
      await this.orderRepository.save(order, tx);

      return success(order);
    } catch (err) {
      return failure(new Error('Unexpected error creating order'));
    }
  }

  
  private filterNullishCommandItems(items: OrderItemCommand[]): OrderItemCommand[] {
    return items.filter((item) => item.itemId && item.quantity);
  }


  private getTotalAmount(orderItems: OrderItem[]): number {
    return orderItems.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0,
    );
  }

  private async getItems(
    itemCommands: OrderItemCommand[],
    tx?: Transaction,
  ): Promise<Item[]> {
    const itemIds = itemCommands.map((item) => item.itemId);
    const items = await this.itemRepository.findWithIdIn(itemIds, tx);
    if (items.length !== itemIds.length) {
      const foundItemIds = new Set(items.map((item) => item.id));
      const missingItemIds = itemIds.filter((id) => !foundItemIds.has(id));
      throw new ItemNotFoundException(missingItemIds.join(','));
    }
    return items;
  }

  private processOrderItems(
    itemCommands: OrderItemCommand[],
    items: Item[],
  ): OrderItem[] {
    const mappedItems: Map<string, Item> = new Map();
    for (const item of items) {
      mappedItems.set(item.id, item);
    }
    const orderItems: OrderItem[] = [];
    for (const itemCommand of itemCommands) {
      const item = mappedItems.get(itemCommand.itemId);

      if (!item) {
        throw new ItemNotFoundException(itemCommand.itemId);
      }

      orderItems.push(
        new OrderItem(
          itemCommand.id,
          itemCommand.itemId,
          itemCommand.quantity,
          item.price.value,
        ),
      );
    }

    return orderItems;
  }

  private createOrderEntity(
    orderId: string,
    userId: string,
    orderItems: OrderItem[],
    totalAmount: number,
  ): Order {
    return new Order(
      orderId,
      orderItems,
      new OrderStatus(OrderStatusEnum.PENDING),
      totalAmount,
      userId,
    );
  }
}
