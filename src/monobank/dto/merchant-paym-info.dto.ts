import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MerchantPaymInfo {
  @ApiProperty({
    description: 'Unique reference number for the payment',
    example: 'REF123456789',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Payment destination or purpose',
    example: 'Gym Membership Subscription',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  destination: string;

  @ApiProperty({
    description: 'Additional payment information or notes',
    example: 'Monthly subscription for March 2024',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
