import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UsersService } from '../users/users.service';
import { MembershipStatus } from './enum/membership-status.enum';
import { MonobankClient } from '../monobank/monobank-client';
import { Membership } from './entity/membership.entity';
import { MONOBANK_CONFIG, UAN_CCY } from '../monobank/constants';
import { IMonobankConfig } from '../monobank/interface/monobank-config.interface';
import { BasicCrudService } from '../common/basic-crud.service';
import { MembershipRepository } from './repositories/membership.repository';
import { CacheService } from '../cache/cache.service';
import { MONTHLY_MEMBERSHIP_PRICE } from './constants';
import { UserMetadata } from '../auth/types/user-metadata.type';

@Injectable()
export class MembershipService extends BasicCrudService<Membership> {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @Inject(MONOBANK_CONFIG) private readonly config: IMonobankConfig,
    @InjectRepository(Membership)
    protected readonly membershipRepository: MembershipRepository,
    private readonly userService: UsersService,
    private readonly monobankClient: MonobankClient,
    protected readonly cacheService: CacheService,
    protected readonly entityManager: EntityManager,
  ) {
    super(Membership, membershipRepository, cacheService, entityManager);
  }

  async create(
    dto: CreateMembershipDto,
    meta: UserMetadata,
  ): Promise<{ paymentUrl: string }> {
    const user = await this.userService.findOneOrFail(meta.userId);
    const membership = await this.getMembership(meta);

    if (membership && membership.status == 'active') {
      throw new BadRequestException('You have already paid for membership');
    }

    const amount = dto.monthNum * MONTHLY_MEMBERSHIP_PRICE;

    const invoicePayload = {
      amount: amount,
      ccy: UAN_CCY,
      redirectUrl: this.config.redirectUrl,
      merchantPaymInfo: {
        reference: user.id.toString(),
        destination: 'Оплата абонемента',
        comment: `Абонемент для користувача ID: ${meta.userId}`,
      },
      webhookUrl: this.config.webhookUrl,
    };

    const { invoiceId, pageUrl } = await this.monobankClient.invoiceCreate({
      ...invoicePayload,
      token: this.config.monobankToken,
    });

    const now = new Date();
    await this.createOne({
      user,
      amount: amount,
      startDate: undefined,
      endDate: undefined,
      status: MembershipStatus.PENDING,
      invoiceId,
      paymentUrl: pageUrl,
      createdAt: now,
      updatedAt: now,
    });

    return { paymentUrl: pageUrl };
  }

  async handleWebhook(data: any): Promise<void> {
    this.logger.debug(
      `Got data from monobank webhook: ${JSON.stringify(data)}`,
    );
    const { invoiceId, status, amount } = data;

    const membership = await this.findOneOrFail({ invoiceId });

    if (status === 'success') {
      const monthNum = amount / MONTHLY_MEMBERSHIP_PRICE;
      membership.startDate = new Date();
      membership.endDate = new Date(
        new Date().setMonth(membership.startDate.getMonth() + monthNum),
      );
      membership.status = MembershipStatus.ACTIVE;
      membership.paidAt = new Date();
      membership.updatedAt = new Date();
    } else if (status === 'failure') {
      membership.status = MembershipStatus.CANCELLED;
    }
    await this.updateOne({ id: membership.id }, membership);
  }

  async getMembership(meta: UserMetadata) {
    const user = await this.userService.findOne(meta.userId);
    const membership = await this.findOne({
      user,
      status: MembershipStatus.ACTIVE,
    });
    if (
      membership &&
      membership.status == 'active' &&
      membership.endDate &&
      membership.endDate < new Date()
    ) {
      membership.status = MembershipStatus.EXPIRED;
    }

    if (membership) {
      const { invoiceId, paymentUrl, amount, ...membershipData } = membership;
      return membershipData;
    } else {
      return null;
    }
  }
}
