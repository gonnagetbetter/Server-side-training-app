import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TrainingType } from '../enums/training-type.enum';
import { TrainingStatus } from '../enums/training-status';

export class FindTrainingArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'ID of the training to find',
    example: 1,
    minimum: 1,
  })
  id?: number;

  @IsOptional()
  @IsEnum(TrainingType)
  @ApiProperty({
    enum: TrainingType,
    required: false,
    description: 'Type of the training session (individual or group)',
    example: TrainingType.INDIVIDUAL,
  })
  trainingType?: TrainingType;

  @IsOptional()
  @IsEnum(TrainingStatus)
  @ApiProperty({
    enum: TrainingStatus,
    required: false,
    description: 'Current status of the training session (FINISHED, FUTURE, CANCELLED)',
    example: TrainingStatus.FINISHED,
  })
  status?: TrainingStatus;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the trainer conducting the training',
    example: 1,
  })
  trainer?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the individual trainee (for individual trainings)',
    example: 2,
  })
  trainee?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the trainee group (for group trainings)',
    example: 3,
  })
  traineeGroup?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the exercise set assigned to the training',
    example: 4,
  })
  exerciseSetId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Exact description text to match (case-sensitive)',
    example: 'Upper body strength training',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Search term to filter trainings by description (case-insensitive partial match)',
    example: 'strength',
  })
  search?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    required: false,
    description: 'Filter trainings by notification status (true = notified, false = not notified)',
    example: true,
  })
  NotifiedAbout?: boolean;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    required: false,
    description: 'Filter trainings by specific date (exact match)',
    example: '2024-03-20T15:00:00Z',
  })
  date?: Date;
}
