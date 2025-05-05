import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  street: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  country: string;
}

export class ShippingItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  priceAtOrder: number;
}

export class ShippingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  shippingAddress: AddressDto;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [ShippingItemDto] })
  items: ShippingItemDto[];

} 