import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserSubscription } from './user-subscription.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceMonthly: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceAnnual: number;

  @Column({ type: 'jsonb', nullable: true })
  features: any;

  @Column({ type: 'jsonb', nullable: true })
  serviceLimits: any;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserSubscription, (subscription) => subscription.plan)
  subscriptions: UserSubscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
