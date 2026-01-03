import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  planId: string;

  @Column({ length: 20, default: 'active' })
  status: string;

  @Column({ length: 10, default: 'monthly' })
  billingCycle: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ length: 255, nullable: true })
  stripeSubscriptionId: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
