import { ShippingRepository } from '@shippings/domain/repos/shipping.repository';
import { Shipping } from '@shippings/domain/entitys/shipping.entity';
import { ShippingStatusEnum } from '@shippings/domain/value-objects/shipping-status.vo';
import { ShippingNotFoundException } from '@shippings/domain/errors/shipping-not-found.error';
import { InvalidShippingStatusException } from '@shippings/domain/errors/invalid-shipping-status.error';
import { Result, failure, success } from '@shared/ROP/result';
import { Transaction } from '@shared/persistance/transactions';
import { SHIPPING_REPOSITORY } from '@shippings/domain/repos/shipping.repository';
import { Inject } from '@nestjs/common';

export class UpdateShippingStatusUseCase {
  constructor(
    @Inject(SHIPPING_REPOSITORY)
    private readonly shippingRepository: ShippingRepository,
  ) { }

  async execute(
    shippingId: string,
    status: ShippingStatusEnum,
    tx?: Transaction,
  ): Promise<Result<Shipping, Error>> {
    // 1. Verificar que el envío existe
    const shipping = await this.shippingRepository.findById(shippingId, tx);
    if (!shipping) {
      return failure(new ShippingNotFoundException(`Shipping with id ${shippingId} not found`));
    }

    // 2. Actualizar el estado según la transición válida
    try {
      if (status === ShippingStatusEnum.SHIPPED) {
        shipping.markAsShipped();
      } else if (status === ShippingStatusEnum.DELIVERED) {
        shipping.markAsDelivered();
      } else {
        return failure(new InvalidShippingStatusException(`Invalid status transition to ${status}`));
      }
    } catch (error) {
      return failure(error);
    }

    // 3. Guardar los cambios
    return success(await this.shippingRepository.update(shipping, tx));
  }
} 