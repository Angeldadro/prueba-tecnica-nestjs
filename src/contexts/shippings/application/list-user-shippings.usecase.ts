import { Inject, Injectable } from '@nestjs/common';
import { failure, Result, success } from '@shared/ROP/result';
import { Shipping } from '@shippings/domain/entitys/shipping.entity';
import {
  SHIPPING_REPOSITORY,
  ShippingRepository,
} from '@shippings/domain/repos/shipping.repository';

@Injectable()
export class ListUserShippingsUseCase {
  constructor(
    @Inject(SHIPPING_REPOSITORY)
    private readonly shippingRepository: ShippingRepository,
  ) {}

  async execute(userId: string): Promise<Result<Shipping[], Error>> {
    try {
      const shippings = await this.shippingRepository.findByUserId(userId);
      return success(shippings);
    } catch (error) {
      return failure(error as Error);
    }
  }
} 