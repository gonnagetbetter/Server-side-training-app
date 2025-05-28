import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsNumber, Min } from 'class-validator';

export class GetTrainerStatsDto {
  @ApiProperty({ 
    required: false,
    description: 'Start date of the statistics period (if not specified, will be calculated based on monthsNum)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    required: false,
    description: 'End date of the statistics period (if not specified, current date will be used)',
    example: '2024-03-20T00:00:00Z',
  })
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    required: false,
    description: 'Number of months to include in the statistics (minimum 1 month)',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  monthsNum?: number;

  @ApiProperty({ 
    required: true,
    description: 'ID of the trainer for whom to generate statistics',
    example: 1,
  })
  @IsNumber()
  madeFor: number;
}
