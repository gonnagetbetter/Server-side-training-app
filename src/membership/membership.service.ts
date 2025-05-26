import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UsersService } from '../users/users.service';
import { MembershipStatus } from './enum/membership-status.enum';
import { MonobankClient } from '../monobank/monobank-client';
import { Membership } from './entity/membership.entity';
import { MONOBANK_CONFIG } from '../monobank/constants';
import { IMonobankConfig } from '../monobank/interface/monobank-config.interface';

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @Inject(MONOBANK_CONFIG) private readonly config: IMonobankConfig,
    @InjectRepository(Membership)
    private readonly membershipRepo: EntityRepository<Membership>,
    private readonly userService: UsersService,
    private readonly monobankClient: MonobankClient,
  ) {}

  async create(dto: CreateMembershipDto): Promise<{ paymentUrl: string }> {
    const user = await this.userService.findOneOrFail(dto.userId);

    const invoicePayload = {
      amount: dto.amount * 100, // kopiyka
      ccy: 980, // UAH
      redirectUrl: 'http://localhost:3001/',
      merchantPaymInfo: {
        reference: user.id.toString(),
        destination: `Оплата абонемента`,
        comment: `Абонемент для користувача ID: ${dto.userId}`,
      },
      webhookUrl: this.config.webhookUrl,
    };

    const { invoiceId, pageUrl } = await this.monobankClient.invoiceCreate({
      ...invoicePayload,
      token: this.config.monobankToken,
    });

    const now = new Date();
    const membership = this.membershipRepo.create({
      user,
      amount: dto.amount,
      startDate: dto.startDate ? new Date(dto.startDate) : now,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: MembershipStatus.PENDING,
      invoiceId,
      paymentUrl: pageUrl,
      createdAt: now,
      updatedAt: now,
    });

    await this.membershipRepo.persistAndFlush(membership);

    return { paymentUrl: pageUrl };
  }

  async handleWebhook(data: any): Promise<void> {
    this.logger.debug(
      `Got data from monobank webhook: ${JSON.stringify(data)}`,
    );
    const { invoiceId, status } = data;

    const membership = await this.membershipRepo.findOne({ invoiceId });
    if (!membership) throw new NotFoundException('Membership not found');

    if (status === 'success') {
      membership.status = MembershipStatus.ACTIVE;
      membership.paidAt = new Date();
    } else if (status === 'failure') {
      membership.status = MembershipStatus.CANCELLED;
    }

    await this.membershipRepo.flush();
  }
}
