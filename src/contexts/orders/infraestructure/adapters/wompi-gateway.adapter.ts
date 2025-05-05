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
        
        console.log('Generating signature with data:', { 
            cleanedReference,
            amountInCents, 
            currency, 
            integrityToken: this.integrityToken,
            data 
        });
        
        const signature = createHash('sha256')
            .update(data)
            .digest('hex');
            
        console.log('Generated signature:', signature);
        return signature;
    }

    private async tokenizeCard(cardDetails: CardDetails): Promise<string> {
        try {
            console.log('Tokenizing card with details:', {
                number: cardDetails.number,
                exp_month: cardDetails.expMonth,
                exp_year: cardDetails.expYear,
                cvc: cardDetails.cvc,
                card_holder: cardDetails.cardHolder,
            });

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

            console.log('Card tokenization response:', response.data);
            return response.data.data.id;
        } catch (error) {
            console.error('Error tokenizing card:', error.response?.data || error.message);
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

        console.log('Creating transaction with data:', transactionData);

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

            console.log('Transaction response:', response.data);

            const transaction = response.data.data;
            return {
                success: transaction.status === 'APPROVED',
                transactionId: transaction.id,
                message: transaction.status_message || 'Payment processed',
            };
        } catch (error) {
            console.error('Error creating transaction:', {
                error: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            
            const errorData = error.response?.data;
            const errorMessage = errorData?.error?.messages 
                ? JSON.stringify(errorData.error.messages)
                : error.message;
            
            throw new Error(`Failed to create transaction: ${errorMessage}`);
        }
    }

    private async checkTransactionStatus(transactionId: string): Promise<PaymentResult> {
        const maxAttempts = 30; // 60 segundos / 2 segundos = 30 intentos
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                console.log(`Checking transaction status for ID: ${transactionId} (attempt ${attempts + 1}/${maxAttempts})`);
                const response = await axios.get(
                    `${this.baseUrl}/transactions/${transactionId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.privateKey}`,
                        },
                    }
                );

                console.log('Transaction status response:', response.data);

                const transaction = response.data.data;
                
                if (transaction.status === 'APPROVED') {
                    return {
                        success: true,
                        transactionId: transaction.id,
                        message: transaction.status_message || 'Payment approved',
                    };
                } else if (transaction.status === 'DECLINED' || transaction.status === 'ERROR') {
                    return {
                        success: false,
                        transactionId: transaction.id,
                        message: transaction.status_message || 'Payment declined',
                    };
                }

                // Si está pendiente, esperamos 2 segundos antes de intentar de nuevo
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            } catch (error) {
                console.error('Error checking transaction status:', error.response?.data || error.message);
                throw new Error('Failed to check transaction status');
            }
        }

        // Si llegamos aquí, significa que la transacción sigue pendiente después de 60 segundos
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
        console.log('Starting payment process with:', {
            amount,
            email,
            acceptanceToken,
            orderId,
            cardDetails: {
                number: cardDetails.number,
                expMonth: cardDetails.expMonth,
                expYear: cardDetails.expYear,
                cardHolder: cardDetails.cardHolder,
            },
        });

        try {
            const cardToken = await this.tokenizeCard(cardDetails);
            console.log('Card tokenized successfully:', cardToken);

            const result = await this.createTransaction(
                amount,
                cardToken,
                email,
                acceptanceToken,
                orderId
            );

            // Verificamos el estado de la transacción
            console.log('Transaction created, checking status...');
            return await this.checkTransactionStatus(result.transactionId);
        } catch (error) {
            console.error('Payment processing failed:', error);
            throw error;
        }
    }
} 





