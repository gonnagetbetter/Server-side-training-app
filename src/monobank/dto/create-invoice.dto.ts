import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MerchantPaymInfo } from './merchant-paym-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Payment amount in kopiyka (1 UAH = 100 kopiyka)',
    example: 10000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Merchant token for authentication',
    example: 'merchant_token_123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Currency code (optional)',
    example: 980,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ccy?: number;

  @ApiProperty({
    description: 'Merchant payment information',
    type: MerchantPaymInfo,
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MerchantPaymInfo)
  merchantPaymInfo: MerchantPaymInfo;

  @ApiProperty({
    description: 'URL to redirect after payment completion',
    example: 'https://example.com/success',
    required: false,
  })
  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @ApiProperty({
    description: 'URL for payment status webhook notifications',
    example: 'https://example.com/webhook',
    required: false,
  })
  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @ApiProperty({
    description: 'Invoice validity period in seconds',
    example: 3600,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  validity?: number;
}
