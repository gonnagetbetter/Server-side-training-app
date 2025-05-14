import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { User } from './entities/user.entity';
import { FindUserArgs } from './args/find-user.args';
import { UserRole } from './enums/user-role.enum';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all users',
    type: User,
    isArray: true,
  })
  findAll(@Query() args: FindUserArgs) {
    return this.usersService.complexSearch(args);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the current user',
    type: User,
  })
  getMe(@UserMeta() meta: UserMetadata) {
    return this.usersService.findOneByIdSafe(meta.userId);
  }

  @Get('/me/clients')
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all clients',
    type: User,
    isArray: true,
  })
  findAllClients(@UserMeta() meta: UserMetadata) {
    return this.usersService.complexSearch({ trainer_id: meta.userId });
  }

  @Patch()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates a user',
  })
  update(@Body() dto: UpdateUserDto) {
    return this.usersService.update(dto);
  }
}
