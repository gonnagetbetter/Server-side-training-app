import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MerchantPaymInfo } from './merchant-paym-info.dto';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number; // in kopiyka (1 UAH = 100 kopiyka)

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsNumber()
  ccy?: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MerchantPaymInfo)
  merchantPaymInfo: MerchantPaymInfo;

  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsNumber()
  validity?: number;
}
