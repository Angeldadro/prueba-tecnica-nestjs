import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString, IsUUID, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { OrderItemDto } from '@orders/infraestructure/dtos/order-item.dto';
import { AddressDto } from '@orders/infraestructure/dtos/address.dto';
import { PaymentDetailsDto } from '@orders/infraestructure/dtos/payment-details.dto';
import { ShippingDto } from '@shippings/infraestructure/dtos/shipping.dto';
import { CardDetailsDto } from './card-details.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 'order-uuid-1234' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'user-uuid-1234' })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];


  @ApiProperty()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    example: 'tok_stagtest_5113_62A3734Bb228d7aeFb8868af79bd2ba5',
    description: 'Token de aceptación de Wompi'
  })
  acceptanceToken: string;

  @ValidateNested()
  @Type(() => CardDetailsDto)
  cardDetails: CardDetailsDto;
}
