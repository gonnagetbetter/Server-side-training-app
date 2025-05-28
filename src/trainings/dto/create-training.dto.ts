import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { TrainingType } from '../enums/training-type.enum';

export class CreateTrainingDto {
  @ApiProperty({
    enum: TrainingType,
    description: 'Type of the training session',
    example: TrainingType.INDIVIDUAL,
    required: true,
  })
  @IsEnum(TrainingType)
  trainingType: TrainingType;

  @ApiProperty({ 
    required: false, 
    description: 'ID of the trainer conducting the training',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  trainer?: number;

  @ApiProperty({ 
    required: false, 
    description: 'ID of the individual trainee (required for individual trainings)',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  trainee?: number;

  @ApiProperty({ 
    required: false, 
    description: 'ID of the trainee group (required for group trainings)',
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  traineeGroup?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Detailed description of the training session',
    example: 'Upper body strength training focusing on chest and shoulders',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Date and time of the training session',
    example: '2024-03-20T15:00:00Z',
    required: true,
  })
  @IsDate()
  date: Date;

  @ApiProperty({ 
    description: 'ID of the exercise set to be performed during the training',
    example: 4,
    required: true,
  })
  @IsNumber()
  ExerciseSetId: number;
}
