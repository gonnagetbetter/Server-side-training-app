import { IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatsReportDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of months to include in the statistics report',
    example: 3,
    required: false,
  })
  monthsNum?: number;

  @ApiProperty({
    required: false,
    description: 'Start date of the statistics period (if not specified, will be calculated based on monthsNum)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    required: false,
    description: 'End date of the statistics period (if not specified, current date will be used)',
    example: '2024-03-20T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    required: false,
    description: 'ID of the user for whom the statistics report is being generated',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  madeFor?: number;
}
