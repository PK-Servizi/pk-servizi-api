import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2023-10-16' as any,
      },
    );
  }

  async createCustomer(user: {
    email: string;
    fullName: string;
    id: string;
  }): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: {
          userId: user.id,
        },
      });
      return customer;
    } catch (error) {
      this.logger.error(`Error creating customer for user ${user.id}`, error);
      throw new BadRequestException('Failed to create Stripe customer');
    }
  }

  async createCheckoutSession(
    userId: string,
    userEmail: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: userEmail,
        metadata: {
          userId,
        },
      });
      return session;
    } catch (error) {
      this.logger.error(
        `Error creating checkout session for user ${userId}`,
        error,
      );
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  async createPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<Stripe.BillingPortal.Session> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      this.logger.error(
        `Error creating portal session for customer ${customerId}`,
        error,
      );
      throw new BadRequestException('Failed to create portal session');
    }
  }

  public constructEventFromPayload(
    signature: string,
    payload: Buffer,
  ): Stripe.Event {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }
}
