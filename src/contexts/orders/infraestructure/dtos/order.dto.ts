import { ApiProperty } from '@nestjs/swagger';

class OrderItemResponseDto {
  @ApiProperty({ example: 'uuid-item-1234' })
  id: string;

  @ApiProperty({ example: 'uuid-item-1234' })
  itemId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 15.5 })
  priceAtOrder: number;
}

export class OrderDto {
  @ApiProperty({ example: 'order-uuid-1234' })
  id: string;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ example: 15.5 })
  totalAmount: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  orderItems: OrderItemResponseDto[];

  @ApiProperty({ example: 'txn-123456789' })
  paymentGatewayRef?: string;

  @ApiProperty({ example: '2024-06-30T12:34:56Z' })
  createdAt: Date;
}
