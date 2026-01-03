import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserSubscription } from '../../subscriptions/entities/user-subscription.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  subscriptionId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'EUR' })
  currency: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ length: 50, nullable: true })
  paymentMethod: string;

  @Column({ length: 255, nullable: true })
  stripePaymentIntentId: string;

  @Column({ length: 255, nullable: true })
  stripeChargeId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  paidAt: Date;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserSubscription, (subscription) => subscription.payments)
  @JoinColumn({ name: 'subscription_id' })
  subscription: UserSubscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
