import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '@/domain/repos/order.repository';
import { Transaction } from '../domain/repos/transactions';
import { CardDetails } from '../domain/value_object/card-details.vo';
import { OrderNotFoundException } from '../domain/errors/order-not-found.error';
import { Order } from '../domain/entitys/order.entity';
import {
  PAYMENT_GATEWAY,
  PaymentGateway,
  PaymentResult,
} from '../domain/repos/payment-gateway.port';
import { PaymentFailedException } from '../domain/errors/payment-failed.error';
import { AddressData } from '../domain/value_object/address.vo';
import { failure, Result, success } from '../shared/result';

interface PayOrderCommand {
  id: string;
  deliveryAddress: AddressData;
  paymentDetails: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
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
      command.paymentDetails.cardNumber,
      command.paymentDetails.expiryMonth,
      command.paymentDetails.expiryYear,
      command.paymentDetails.cvv,
    );

    const paymentResult = await this.paymentGateway.processPayment(
      totalAmount,
      cardDetails,
      order.id,
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
