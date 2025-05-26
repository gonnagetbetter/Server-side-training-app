import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StatsReportService } from './stats.service';
import { CreateStatsReportDto } from './dto/create-stats-report';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { GetGeneralStatsDto } from './dto/get-general-stats.dto';
import { GetTrainerStatsDto } from './dto/get-trainer-stats.dto';

@Controller('stats')
@UseGuards(AuthGuard)
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsReportService: StatsReportService) {}

  @Post('anual')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns anual report',
  })
  createAttendanceReport(
    @UserMeta() meta: UserMetadata,
    @Body() dto: CreateStatsReportDto,
  ) {
    return this.statsReportService.createAttendanceReport(dto, meta.userId);
  }

  @Post('general')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns general statistics for the specified period',
  })
  getGeneralStats(@Body() dto: GetGeneralStatsDto) {
    return this.statsReportService.getGeneralStats(dto);
  }

  @Get('trainer stats')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns trainer statistics for the specified period',
  })
  getTrainerStats(@Query() dto: GetTrainerStatsDto) {
    return this.statsReportService.getTrainerStats(dto);
  }
}
