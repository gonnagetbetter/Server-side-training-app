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
    description: 'ID of the training',
  })
  id?: number;

  @IsOptional()
  @IsEnum(TrainingType)
  @ApiProperty({
    enum: TrainingType,
    required: false,
    description: 'Type of the training (individual or group)',
  })
  trainingType?: TrainingType;

  @IsOptional()
  @IsEnum(TrainingStatus)
  @ApiProperty({
    enum: TrainingStatus,
    required: false,
    description: 'Status of the training (FINISHED, FUTURE, CANCELLED)',
  })
  status?: TrainingStatus;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the trainer',
  })
  trainer?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the trainee',
  })
  trainee?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the trainee group',
  })
  traineeGroup?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'ID of the exercise set',
  })
  exercSetId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Description of the training',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Search term for filtering trainings by description',
  })
  search?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    required: false,
    description: 'Flag for filtering trainings by notification status',
  })
  NotifiedAbout?: boolean;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    required: false,
    description: 'Flag for filtering trainings by date',
  })
  date?: Date;
}
