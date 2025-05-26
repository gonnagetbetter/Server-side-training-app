import { IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatsReportDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exercise set ID',
  })
  monthsNum: number;

  @ApiProperty({ required: false, description: 'Start date of the statistics period' })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false, description: 'End date of the statistics period' })
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
