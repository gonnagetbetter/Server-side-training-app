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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { MonobankWebhookGuard } from '../monobank/guards/monobank-webhook.guard';

@Controller('membership')
@ApiTags('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('membership-invoice')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Creates a membership invoice for the current user',
  })
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

  @Get('mine')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the membership for the current user',
  })
  async getMembership(@UserMeta() meta: UserMetadata) {
    return this.membershipService.getMembership(meta);
  }
}
