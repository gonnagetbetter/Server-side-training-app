import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StatsReportService } from './stats.service';

@Controller('stats')
@UseGuards(AuthGuard)
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsReportService: StatsReportService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns anual report',
  })
  createAttendanceReport(
    @Param('id', ParseIntPipe) id: number,
    @Param('monthsNum') monthsNum: number,
  ) {
    return this.statsReportService.createAttendanceReport(id, monthsNum);
  }
}
