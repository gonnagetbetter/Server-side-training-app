import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from '../dto/create-group.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindGroupArgs extends PartialType(CreateGroupDto) {
  @ApiProperty({
    description: 'Search groups by name (partial match)',
    example: 'Morning',
    required: false,
  })
  name?: string;
}
