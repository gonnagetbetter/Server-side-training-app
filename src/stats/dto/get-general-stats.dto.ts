import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class GetGeneralStatsDto {
  @ApiProperty({
    required: false,
    description: 'Start date of the statistics period',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'End date of the statistics period',
    example: '2024-03-20T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    required: false,
    description: 'Number of months to look back from current date',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  monthsNum?: number;
}
