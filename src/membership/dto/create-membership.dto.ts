import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({
    description: 'Number of months for the membership subscription',
    example: 3,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  monthNum: number;
}
