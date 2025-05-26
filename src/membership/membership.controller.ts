import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('invoice-monobank')
  async create(@Body() dto: CreateMembershipDto) {
    return this.membershipService.create(dto);
  }

  @Post('callback-mono')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any) {
    await this.membershipService.handleWebhook(body);
    return { ok: true };
  }
}
