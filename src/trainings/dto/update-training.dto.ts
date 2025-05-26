import { PartialType } from '@nestjs/swagger';
import { CreateTrainingDto } from './create-training.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {
  @IsArray()
  @IsOptional()
  absentUsers: [];
}
