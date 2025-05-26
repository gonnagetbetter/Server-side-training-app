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
    description: 'Type of the training (individual or group)',
  })
  @IsEnum(TrainingType)
  trainingType: TrainingType;

  @ApiProperty({ required: false, description: 'ID of the trainer' })
  @IsNumber()
  @IsOptional()
  trainer?: number;

  @ApiProperty({ required: false, description: 'ID of the trainee' })
  @IsNumber()
  @IsOptional()
  trainee?: number;

  @ApiProperty({ required: false, description: 'ID of the trainee group' })
  @IsNumber()
  @IsOptional()
  traineeGroup?: number;

  @ApiProperty({ required: false, description: 'Description of the training' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Date of the training' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'ID of the exercise set' })
  @IsNumber()
  ExerciseSetId: number;
}
