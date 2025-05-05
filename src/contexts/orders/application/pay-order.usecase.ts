import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '@orders/domain/repos/order.repository';
import { Transaction } from '@shared/persistance/transactions';
import { CardDetails } from '@orders/domain/value-objects/card-details.vo';
import { NotFoundException as OrderNotFoundException } from '@nestjs/common';
import { Order } from '@orders/domain/entitys/order.entity';
import {
  PAYMENT_GATEWAY,
  PaymentGateway,
  PaymentResult,
} from '@orders/domain/repos/payment-gateway.port';
import { PaymentFailedException } from '@orders/domain/errors/payment-failed.error';
import { failure, Result, success } from '@shared/ROP/result';
import { CardDetailsPrimitives } from '../../shippings/domain/value-objects/card-details.vo';

interface PayOrderCommand {
  id: string;
  paymentDetails: CardDetailsPrimitives;
  email: string;
  acceptanceToken: string;
}

@Injectable()
export class PayOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(
    command: PayOrderCommand,
    tx?: Transaction,
  ): Promise<Result<Order, Error>> {
    const order = await this.orderRepository.findById(command.id, tx);
    if (!order) {
      return failure(new OrderNotFoundException(command.id));
    }

    const totalAmount = order.totalAmount;
    const cardDetails = new CardDetails(
      command.paymentDetails.number,
      command.paymentDetails.cvc,
      command.paymentDetails.expMonth,
      command.paymentDetails.expYear,
      command.paymentDetails.cardHolder,
    );

    const paymentResult = await this.paymentGateway.processPayment(
      totalAmount,
      cardDetails,
      command.id,
      command.email,
      command.acceptanceToken,
    );

    if (!this.validatePayment(paymentResult)) {
      order.markAsRejected();
      await this.orderRepository.update(order);
      return failure(
        new PaymentFailedException(
          paymentResult.message || 'Unknown payment error',
        ),
      );
    }

    order.markAsProcessed(paymentResult.transactionId);
    const updatedOrder = await this.orderRepository.update(order);
    return success(updatedOrder);
  }

  private validatePayment(paymentResult: PaymentResult): boolean {
    if (!paymentResult.success || !paymentResult.transactionId) {
      return false;
    }
    return true;
  }
}
