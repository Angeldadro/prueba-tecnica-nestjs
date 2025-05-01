import { Injectable } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentResult,
} from '@/domain/repos/payment-gateway.port';
import { CardDetails } from '@/domain/value_object/card-details.vo';

@Injectable()
export class PaymentGatewayImpl implements PaymentGateway {
  public async processPayment(
    amount: number,
    cardDetails: CardDetails,
    orderId: string,
  ): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return {
      success: true,
      transactionId: `tx_${orderId}_${Date.now()}`,
      message: 'Payment processed successfully',
    };
  }
}
