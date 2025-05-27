import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsNumber } from 'class-validator';

export class GetTrainerStatsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: true })
  @IsNumber()
  madeFor: number;
}
