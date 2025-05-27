import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { MonobankWebhookGuard } from '../monobank/guards/monobank-webhook.guard';

@Controller('membership')
@ApiTags('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('invoice-monobank')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() dto: CreateMembershipDto,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.membershipService.create(dto, meta);
  }

  @Post('callback-mono')
  @UseGuards(MonobankWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any) {
    await this.membershipService.handleWebhook(body);
    return { ok: true };
  }

  @Get('membership')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getMembership(@UserMeta() meta: UserMetadata) {
    return this.membershipService.getMembership(meta.userId);
  }
}
