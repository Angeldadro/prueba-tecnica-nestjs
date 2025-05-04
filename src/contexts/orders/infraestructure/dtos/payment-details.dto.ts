import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PaymentDetailsDto {
  @ApiProperty({ example: '4111111111111111' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ example: '05' })
  @IsString()
  @Length(2, 2)
  expiryMonth: string;

  @ApiProperty({ example: '2025' })
  @IsString()
  @Length(4, 4)
  expiryYear: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @Length(3, 4)
  cvv: string;
}
