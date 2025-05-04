
import { NotFoundException as ItemNotFoundException } from '@nestjs/common';
import { OrderAlreadyExistsException } from '@orders/domain/errors/order-already-exists.error';
import { ItemAlreadyExistsException } from '@items/domain/errors/item-already-exists.error';
import { PaymentFailedException } from '@orders/domain/errors/payment-failed.error';
import { InvalidCardDetailsException } from '@orders/domain/errors/invalid-card-details.error';
import { InsufficientStockException } from '@items/domain/errors/insufficient-stock.error';
import { NotFoundException } from '@nestjs/common';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';

const errorCodes = {
  [ItemNotFoundException.name]: 404,
  [OrderAlreadyExistsException.name]: 409,
  [ItemAlreadyExistsException.name]: 409,
  [PaymentFailedException.name]: 402,
  [InvalidCardDetailsException.name]: 400,
  [InsufficientStockException.name]: 400,
  [NotFoundException.name]: 404
};

@Catch()
export class OrderExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string | object;
    let errorName: string;

    status = errorCodes[exception.name];
    message = exception.message;
    errorName = exception.name;

    if (!status) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorName = exception.name;
      Logger.error(exception);
    }

    const errorResponsePayload = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      error: errorName,
    };
    response.status(status).send(errorResponsePayload);
    const ip =
      (request.headers['x-forwarded-for'] as string) ||
      (request.socket.remoteAddress as string);

    Logger.error(
      status + ': ' + 'Error ' + errorName + ' ' + message + ' from ' + ip,
    );
  }
}
