import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({ example: 'uuid-1234', description: 'Unique identifier' })
  id: string;

  @ApiProperty({ example: 'Laptop', description: 'Name of the item' })
  name: string;

  @ApiProperty({
    example: 'A good laptop',
    description: 'Description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1000.5, description: 'Price of the item' })
  price: number;

  @ApiProperty({ example: 5, description: 'Available stock' })
  stock: number;
}
