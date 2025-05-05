import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardDetailsDto {
  @ApiProperty({ example: '4242424242424242' })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  number: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  cvc: string;

  @ApiProperty({ example: '08' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Matches(/^(0[1-9]|1[0-2])$/)
  expMonth: string;

  @ApiProperty({ example: '28' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Matches(/^[0-9]{2}$/)
  expYear: string;

  @ApiProperty({ example: 'José Pérez' })
  @IsString()
  @IsNotEmpty()
  cardHolder: string;
} 