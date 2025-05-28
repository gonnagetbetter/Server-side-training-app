import { PartialType } from '@nestjs/swagger';
import { CreateTrainingDto } from './create-training.dto';
import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {
  @ApiProperty({
    description: 'Array of user IDs who were absent from the training',
    type: [Number],
    example: [1, 2, 3],
    required: false,
  })
  @IsArray()
  @IsOptional()
  absentUsers: number[];
}
