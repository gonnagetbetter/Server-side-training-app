import { IsNotEmpty, IsString } from 'class-validator';

export class MerchantPaymInfo {
  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
