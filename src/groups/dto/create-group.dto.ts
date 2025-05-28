import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the training group',
    example: 'Morning Fitness Group',
    required: true,
  })
  name: string;
}
