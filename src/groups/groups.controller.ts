import { AuthGuard } from '../auth/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { FindGroupArgs } from './args/find-group.args';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';

@Controller('groups')
@UseGuards(AuthGuard)
@ApiTags('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Returns all groups',
  })
  findAll(@Query() args: FindGroupArgs) {
    return this.groupsService.findAll(args);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOneSafe(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Creates a group',
  })
  createGroup(@Body() dto: CreateGroupDto, @UserMeta() meta: UserMetadata) {
    return this.groupsService.create(dto, meta.userId);
  }

  @ApiBearerAuth()
  @Patch()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  update(@Body() dto: UpdateGroupDto, @UserMeta() meta: UserMetadata) {
    return this.groupsService.update(dto, meta);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.groupsService.remove(id, meta);
  }
}
