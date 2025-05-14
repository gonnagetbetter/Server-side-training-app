import { AuthGuard } from '../auth/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { FindGroupArgs } from './args/find-group.args';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
@UseGuards(AuthGuard)
@ApiTags('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all groups',
  })
  findAll(@Query() args: FindGroupArgs) {
    return this.groupsService.findAll(args);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOneSafe(id);
  }

  @Put()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Creates a group',
  })
  createGroup(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch()
  update(@Body() dto: UpdateGroupDto) {
    return this.groupsService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}
