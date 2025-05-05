import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-1234' })
  @IsString()
  id: string;
  @ApiProperty({ example: 'uuid-5678' })
  @IsString()
  itemId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
