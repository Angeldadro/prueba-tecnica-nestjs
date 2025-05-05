import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PaymentDetailsDto {
  @ApiProperty({ example: '4111111111111111' })
  @IsString()
  number: string;

  @ApiProperty({ example: '05' })
  @IsString()
  @Length(2, 2)
  expMonth: string;

  @ApiProperty({ example: '2025' })
  @IsString()
  @Length(4, 4)
  expYear: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @Length(3, 4)
  cvc: string;

  @ApiProperty({ example: 'José Pérez' })
  @IsString()
  @IsNotEmpty()
  cardHolder: string;
}
