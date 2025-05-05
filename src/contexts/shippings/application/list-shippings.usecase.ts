import { Inject, Injectable } from '@nestjs/common';
import { Shipping } from '@shippings/domain/entitys/shipping.entity';
import { SHIPPING_REPOSITORY, ShippingRepository } from '@shippings/domain/repos/shipping.repository';
import { Result, success, failure } from '@shared/ROP/result';

@Injectable()
export class ListShippingsUseCase {
  constructor(
    @Inject(SHIPPING_REPOSITORY)
    private readonly shippingRepository: ShippingRepository,
  ) {}

  async execute(): Promise<Result<Shipping[], Error>> {
    try {
      const shippings = await this.shippingRepository.findAll();
      return success(shippings);
    } catch (err) {
      return failure(err as Error);
    }
  }
} 