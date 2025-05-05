import { Inject, Injectable } from '@nestjs/common';
import { ShippingRepository, SHIPPING_REPOSITORY } from '@shippings/domain/repos/shipping.repository';
import { OrderRepository, ORDER_REPOSITORY } from '@orders/domain/repos/order.repository';
import { Shipping } from '@shippings/domain/entitys/shipping.entity';
import { ShippingStatus, ShippingStatusEnum } from '@shippings/domain/value-objects/shipping-status.vo';
import { Result, failure, success } from '@shared/ROP/result';
import { NotFoundException as OrderNotFoundException } from '@nestjs/common';
import { ShippingAlreadyExistsException } from '@shippings/domain/errors/shipping-already-exists.error';
import { OrderNotApprovedException } from '@orders/domain/errors/order-not-approved.error';
import { Transaction } from '@shared/persistance/transactions';
import { Address } from '@shippings/domain/value-objects/address.vo';

@Injectable()
export class CreateShippingUseCase {
  constructor(
    @Inject(SHIPPING_REPOSITORY)
    private readonly shippingRepository: ShippingRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    orderId: string,
    shippingAddress: Address,
    tx?: Transaction,
  ): Promise<Result<Shipping, Error>> {
    try {
      // Verificar que la orden existe
      const order = await this.orderRepository.findById(orderId, tx);
      if (!order) {
        return failure(new OrderNotFoundException(orderId));
      }

      // Verificar que la orden está aprobada
      if (!order.status.isApproved()) {
        return failure(new OrderNotApprovedException(`Order with id ${orderId} is not approved`));
      }

      // Verificar que no existe un envío para esta orden
      const existingShipping = await this.shippingRepository.findByOrderId(orderId, tx);
      if (existingShipping) {
        return failure(new ShippingAlreadyExistsException(orderId));
      }

      // Crear el envío
      const shipping = new Shipping(
        crypto.randomUUID(),
        orderId,
        order.orderItems,
        shippingAddress,
        new ShippingStatus(ShippingStatusEnum.PENDING),
        order.userId,
      );

      // Guardar el envío
      const createdShipping = await this.shippingRepository.create(shipping, tx);
      return success(createdShipping);
    } catch (error) {
      return failure(error);
    }
  }
} 