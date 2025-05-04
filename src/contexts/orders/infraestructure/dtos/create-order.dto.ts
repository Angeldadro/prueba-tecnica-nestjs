import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString } from 'class-validator';
import { OrderItemDto } from '@orders/infraestructure/dtos/order-item.dto';
import { AddressDto } from '@orders/infraestructure/dtos/address.dto';
import { PaymentDetailsDto } from '@orders/infraestructure/dtos/payment-details.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 'order-uuid-1234' })
  @IsString()
  id: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress: AddressDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto;
}
