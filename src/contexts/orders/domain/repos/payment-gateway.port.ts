import { CardDetails } from '@orders/domain/value-objects/card-details.vo';
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message?: string;
}
export interface PaymentGateway {
  processPayment(
    amount: number,
    cardDetails: CardDetails,
    orderId: string,
  ): Promise<PaymentResult>;
}
export const PAYMENT_GATEWAY = Symbol('PaymentGateway');
