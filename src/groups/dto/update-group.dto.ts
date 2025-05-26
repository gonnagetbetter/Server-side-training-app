import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Group ID',
  })
  id: number;
}
