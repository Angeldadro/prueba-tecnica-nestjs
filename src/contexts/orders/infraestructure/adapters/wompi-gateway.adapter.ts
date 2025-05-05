import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createHash } from 'crypto';
import {
    PaymentGateway,
    PaymentResult,
} from '@orders/domain/repos/payment-gateway.port';
import { CardDetails } from '@orders/domain/value-objects/card-details.vo';

@Injectable()
export class WompiGatewayAdapter implements PaymentGateway {
    private readonly baseUrl: string;
    private readonly publicKey: string;
    private readonly privateKey: string;
    private readonly integrityToken: string;
    private readonly currency: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('WOMPI_API_URL') || 'https://api-sandbox.co.uat.wompi.dev/v1';
        this.publicKey = this.configService.get<string>('PUBLIC_STORE_TOKEN') || '';
        this.privateKey = this.configService.get<string>('PRIVATE_STORE_TOKEN') || '';
        this.integrityToken = this.configService.get<string>('INTEGRITY_TOKEN') || '';
        this.currency = this.configService.get<string>('CURRENCY') || 'COP';

        if (!this.publicKey || !this.privateKey || !this.integrityToken) {
            throw new Error('Missing required Wompi configuration');
        }
    }

    private generateSignature(amount: number, currency: string, reference: string): string {
        const amountInCents = Math.round(amount * 100);
        const cleanedReference = reference.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 32);
        const data = `${cleanedReference}${amountInCents}${currency}${this.integrityToken}`;
        return createHash('sha256').update(data).digest('hex');
    }

    private async tokenizeCard(cardDetails: CardDetails): Promise<string> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/tokens/cards`,
                {
                    number: cardDetails.number,
                    exp_month: cardDetails.expMonth,
                    exp_year: cardDetails.expYear,
                    cvc: cardDetails.cvc,
                    card_holder: cardDetails.cardHolder,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.publicKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data?.data?.id) {
                throw new Error('Invalid card tokenization response');
            }

            return response.data.data.id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error?.messages 
                    ? JSON.stringify(error.response.data.error.messages)
                    : 'Failed to tokenize card';
                throw new Error(`Card tokenization failed: ${errorMessage}`);
            }
            throw new Error('Failed to tokenize card');
        }
    }

    private async createTransaction(
        amount: number,
        cardToken: string,
        email: string,
        acceptanceToken: string,
        reference: string
    ): Promise<PaymentResult> {
        const cleanedReference = reference.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 32);
        const signature = this.generateSignature(amount, this.currency, cleanedReference);
        const normalizedEmail = email.toLowerCase().trim();

        const transactionData = {
            acceptance_token: acceptanceToken,
            amount_in_cents: Math.round(amount * 100),
            currency: this.currency,
            signature: signature,
            customer_email: normalizedEmail,
            payment_method: {
                type: 'CARD',
                token: cardToken,
                installments: 1,
            },
            reference: cleanedReference,
        };

        try {
            const response = await axios.post(
                `${this.baseUrl}/transactions`,
                transactionData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.privateKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data?.data?.id) {
                throw new Error('Invalid transaction response');
            }

            return {
                success: true,
                transactionId: response.data.data.id,
                message: 'Transaction created',
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error?.messages 
                    ? JSON.stringify(error.response.data.error.messages)
                    : 'Failed to create transaction';
                throw new Error(`Transaction creation failed: ${errorMessage}`);
            }
            throw new Error('Failed to create transaction');
        }
    }

    private async checkTransactionStatus(transactionId: string): Promise<PaymentResult> {
        const maxAttempts = 30;
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                const response = await axios.get(
                    `${this.baseUrl}/transactions/${transactionId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.privateKey}`,
                        },
                    }
                );

                if (!response.data?.data) {
                    throw new Error('Invalid transaction status response');
                }

                const transaction = response.data.data;
                
                if (transaction.status === 'APPROVED') {
                    return {
                        success: true,
                        transactionId: transaction.id,
                        message: 'Payment approved',
                    };
                } else if (transaction.status === 'DECLINED' || transaction.status === 'ERROR') {
                    return {
                        success: false,
                        transactionId: transaction.id,
                        message: transaction.status_message || 'Payment declined',
                    };
                }

                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.error?.messages 
                        ? JSON.stringify(error.response.data.error.messages)
                        : 'Failed to check transaction status';
                    throw new Error(`Transaction status check failed: ${errorMessage}`);
                }
                throw new Error('Failed to check transaction status');
            }
        }

        return {
            success: false,
            transactionId,
            message: 'Transaction timeout: payment still pending after 60 seconds',
        };
    }

    async processPayment(
        amount: number,
        cardDetails: CardDetails,
        orderId: string,
        email: string,
        acceptanceToken: string,
    ): Promise<PaymentResult> {
        try {
            const cardToken = await this.tokenizeCard(cardDetails);
            const result = await this.createTransaction(
                amount,
                cardToken,
                email,
                acceptanceToken,
                orderId
            );
            return await this.checkTransactionStatus(result.transactionId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Payment processing failed: ${error.message}`);
            }
            throw new Error('Payment processing failed');
        }
    }
} 





