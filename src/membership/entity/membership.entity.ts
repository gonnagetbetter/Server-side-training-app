import { Entity, Property, PrimaryKey, ManyToOne, Enum } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { MembershipStatus } from '../enum/membership-status.enum';

@Entity()
export class Membership {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @ManyToOne(() => User)
  @ApiProperty({ type: () => User })
  user: User;

  @Property({ type: 'datetime' })
  @ApiProperty()
  startDate: Date;

  @Property({ type: 'datetime', nullable: true })
  @ApiProperty({ required: false })
  endDate?: Date;

  @Enum(() => MembershipStatus)
  @ApiProperty({ enum: MembershipStatus })
  status: MembershipStatus;

  @Property({ nullable: true })
  @ApiProperty({ required: false, description: 'Monobank invoice ID' })
  invoiceId?: string;

  @Property({ nullable: true })
  @ApiProperty({
    required: false,
    description: 'Link to Monobank invoice page',
  })
  paymentUrl?: string;

  @Property({ type: 'datetime', nullable: true })
  @ApiProperty({
    required: false,
    description: 'Payment confirmation timestamp',
  })
  paidAt?: Date;

  @Property({ nullable: true })
  @ApiProperty({ required: false, description: 'Amount paid in UAH' })
  amount?: number;

  @Property({ type: 'datetime', onCreate: () => new Date() })
  @ApiProperty()
  createdAt: Date;

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  @ApiProperty()
  updatedAt: Date;
}
