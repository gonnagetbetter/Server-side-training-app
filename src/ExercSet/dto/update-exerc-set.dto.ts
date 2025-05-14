import { PartialType } from '@nestjs/swagger';
import { CreateExercSetDto } from './create-exerc-set.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateExercSetDto extends PartialType(CreateExercSetDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exercise set ID',
  })
  id: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: 'Array of exercise IDs',
    type: [Number],
    required: false,
  })
  exerciseIds?: number[];
} 