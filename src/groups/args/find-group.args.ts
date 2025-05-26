import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from '../dto/create-group.dto';

export class FindGroupArgs extends PartialType(CreateGroupDto) {}
