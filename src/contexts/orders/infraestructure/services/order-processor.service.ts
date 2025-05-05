import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { DecreaseItemStockUseCase } from '@items/application/decrease-item-stock.usecase';
import { CreateOrderUseCase } from '@orders/application/create-order.usecase';
import { PayOrderUseCase } from '@orders/application/pay-order.usecase';
import { CreateShippingUseCase } from '@shippings/application/create-shipping.usecase';
import { Result, success, failure } from '@shared/ROP/result';
import { Address } from '@shippings/domain/value-objects/address.vo';
import { PrismaService } from '@shared/persistance/prisma.service';

@Injectable()
export class OrderProcessorService {
  constructor(
    private readonly decreaseItemStockUseCase: DecreaseItemStockUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly createShippingUseCase: CreateShippingUseCase,
    private readonly prisma: PrismaService
  ) { }

  async processOrder(
    command: CreateOrderDto,
    userId: string,
    userEmail: string,
  ): Promise<Result<string, Error>> {
    try {
      // 1. Reservar stock
      await this.prisma.$transaction(async (tx) => {
        for (const item of command.items) {
          const stockResult = await this.decreaseItemStockUseCase.execute(
            {
              id: item.itemId,
              quantity: item.quantity,
            },
            tx
          );
          if (!stockResult.isSuccess) {
            throw stockResult.error;
          }
        }
      });

      // 2. Crear orden
      await this.prisma.$transaction(async (tx) => {
        const orderResult = await this.createOrderUseCase.execute(
          {
            ...command,
            userId,
            userEmail,
          },
          tx
        );

        if (!orderResult.isSuccess) {
          throw orderResult.error;
        }
      });

      // 3. Procesar pago
      await this.prisma.$transaction(async (tx) => {
        const paymentResult = await this.payOrderUseCase.execute(
          {
            id: command.id,
            paymentDetails: {
              number: command.paymentDetails.number,
              cvc: command.paymentDetails.cvc,
              expMonth: command.paymentDetails.expMonth,
              expYear: command.paymentDetails.expYear,
              cardHolder: command.paymentDetails.cardHolder,
            },
            email: userEmail,
            acceptanceToken: command.acceptanceToken,
          },
          tx
        );

        if (!paymentResult.isSuccess) {
          throw paymentResult.error;
        }
      }, { maxWait: 1000000, timeout: 1000000 });

      // 4. Crear envío
      await this.prisma.$transaction(async (tx) => {
        const shippingAddress = new Address(
          command.shippingAddress.street,
          command.shippingAddress.city,
          command.shippingAddress.state,
          command.shippingAddress.zipCode,
          command.shippingAddress.country,
        );

        const shippingResult = await this.createShippingUseCase.execute(
          command.id,
          shippingAddress,
          tx
        );

        if (!shippingResult.isSuccess) {
          throw shippingResult.error;
        }
      });

      return success(command.id);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
