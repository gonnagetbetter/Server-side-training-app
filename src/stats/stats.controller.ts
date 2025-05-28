import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StatsReportService } from './stats.service';
import { CreateStatsReportDto } from './dto/create-stats-report.dto';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { GetGeneralStatsDto } from './dto/get-general-stats.dto';
import { GetTrainerStatsDto } from './dto/get-trainer-stats.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('stats')
@UseGuards(AuthGuard)
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsReportService: StatsReportService) {}

  @Post('attendanceReport')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns attendance report report',
  })
  createAttendanceReport(
    @UserMeta() meta: UserMetadata,
    @Body() dto: CreateStatsReportDto,
  ) {
    return this.statsReportService.createAttendanceReport(dto, meta);
  }

  @Post('general')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Returns general statistics for the specified period',
  })
  getGeneralStats(
    @Body() dto: GetGeneralStatsDto,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.statsReportService.getGeneralStats(dto, meta);
  }

  @Post('trainerStats')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN || UserRole.TRAINER)
  @ApiOkResponse({
    description: 'Returns trainer statistics for the specified period',
  })
  getTrainerStats(
    @Body() dto: GetTrainerStatsDto,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.statsReportService.getTrainerStats(dto, meta);
  }
}
