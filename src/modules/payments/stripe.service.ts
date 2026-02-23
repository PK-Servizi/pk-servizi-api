import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

/**
 * Unified Stripe Service
 * Handles all Stripe operations for payments and subscriptions
 */
@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2024-11-20.acacia' as any,
      });
      this.logger.log('Stripe service initialized successfully');
    } else {
      this.logger.warn(
        'STRIPE_SECRET_KEY not configured - Stripe features will be disabled',
      );
      this.stripe = null;
    }
  }

  /**
   * Create checkout session with flexible parameters
   */
  async createCheckoutSession(params: {
    priceId?: string;
    userId: string;
    userEmail: string;
    planId?: string;
    billingCycle?: 'monthly' | 'annual';
    successUrl?: string;
    cancelUrl?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    // Determine price ID
    let priceId = params.priceId;
    if (!priceId && params.billingCycle) {
      priceId =
        params.billingCycle === 'monthly'
          ? this.configService.get<string>('STRIPE_PRICE_ID_MONTHLY')
          : this.configService.get<string>('STRIPE_PRICE_ID_ANNUAL');
    }

    if (!priceId) {
      throw new BadRequestException(
        'Price ID or billing cycle must be provided',
      );
    }

    const frontendUrl = this.configService.get('FRONTEND_URL');
    const successUrl =
      params.successUrl ||
      `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = params.cancelUrl || `${frontendUrl}/payment/cancel`;

    this.logger.debug(`Creating checkout session for user ${params.userId}`);

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
        customer_email: params.userEmail,
        client_reference_id: params.userId,
        metadata: {
          userId: params.userId,
          planId: params.planId,
          billingCycle: params.billingCycle,
          ...params.metadata,
        },
        subscription_data: {
          metadata: {
            userId: params.userId,
            planId: params.planId,
          },
        },
      });

      this.logger.log(
        `Checkout session ${session.id} created for user ${params.userId}`,
      );
      return session;
    } catch (error) {
      this.logger.error(`Failed to create checkout session: ${error.message}`);
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  /**
   * Create Stripe customer
   */
  async createCustomer(user: any): Promise<Stripe.Customer> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      return await this.stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: {
          userId: user.id,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create customer: ${error.message}`);
      throw new BadRequestException('Failed to create customer');
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      return await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
    } catch (error) {
      this.logger.error(`Failed to create subscription: ${error.message}`);
      throw new BadRequestException('Failed to create subscription');
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve subscription ${subscriptionId}: ${error.message}`,
      );
      throw new BadRequestException('Subscription not found');
    }
  }

  /**
   * Retrieve subscription (alias for getSubscription)
   */
  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.getSubscription(subscriptionId);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    atPeriodEnd: boolean = false,
  ): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      if (atPeriodEnd) {
        return await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      } else {
        return await this.stripe.subscriptions.cancel(subscriptionId);
      }
    } catch (error) {
      this.logger.error(
        `Failed to cancel subscription ${subscriptionId}: ${error.message}`,
      );
      throw new BadRequestException('Failed to cancel subscription');
    }
  }

  /**
   * Update subscription plan
   */
  async updateSubscriptionPlan(
    subscriptionId: string,
    newPriceId: string,
  ): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;

      return await this.stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: itemId,
            price: newPriceId,
          },
        ],
        proration_behavior: 'always_invoice',
      });
    } catch (error) {
      this.logger.error(
        `Failed to update subscription ${subscriptionId}: ${error.message}`,
      );
      throw new BadRequestException('Failed to upgrade subscription');
    }
  }

  /**
   * List customer subscriptions
   */
  async getCustomerSubscriptions(
    customerId: string,
  ): Promise<Stripe.Subscription[]> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        limit: 100,
      });
      return subscriptions.data;
    } catch (error) {
      this.logger.error(`Failed to list subscriptions: ${error.message}`);
      throw new BadRequestException('Failed to fetch subscriptions');
    }
  }

  /**
   * Create one-time payment checkout session (for upgrades, etc.)
   */
  async createOneTimePayment(params: {
    amount: number; // in cents
    currency: string;
    customerEmail: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: params.currency,
              unit_amount: params.amount,
              product_data: {
                name: params.description,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        customer_email: params.customerEmail,
        metadata: params.metadata || {},
      });

      this.logger.log(`One-time payment session ${session.id} created`);
      return session;
    } catch (error) {
      this.logger.error(
        `Failed to create one-time payment session: ${error.message}`,
      );
      throw new BadRequestException('Failed to create payment session');
    }
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: any,
  ): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      return await this.stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        metadata,
      });
    } catch (error) {
      this.logger.error(`Failed to create payment intent: ${error.message}`);
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  /**
   * Create checkout session for one-time payment (service requests)
   */
  async createPaymentCheckoutSession(params: {
    amount: number;
    currency: string;
    serviceRequestId: string;
    userId: string;
    userEmail?: string;
    description?: string;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<Stripe.Checkout.Session> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
    const successUrl =
      params.successUrl ||
      `${frontendUrl}/service-requests/${params.serviceRequestId}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl =
      params.cancelUrl ||
      `${frontendUrl}/service-requests/${params.serviceRequestId}/payment-cancelled`;

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: params.currency,
              unit_amount: params.amount * 100, // Convert to cents
              product_data: {
                name: params.description || 'Service Request Payment',
                description: `Payment for service request ${params.serviceRequestId}`,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: params.userEmail,
        client_reference_id: params.userId,
        metadata: {
          userId: params.userId,
          serviceRequestId: params.serviceRequestId,
        },
      });

      this.logger.log(
        `Payment checkout session ${session.id} created for service request ${params.serviceRequestId}`,
      );
      return session;
    } catch (error) {
      this.logger.error(
        `Failed to create payment checkout session: ${error.message}`,
      );
      throw new BadRequestException(
        'Failed to create payment checkout session',
      );
    }
  }

  /**
   * Get payment intent
   */
  async getPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error(`Failed to retrieve payment intent: ${error.message}`);
      throw new BadRequestException('Payment not found');
    }
  }

  /**
   * Get checkout session details
   */
  async getCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      this.logger.log(`Retrieving checkout session: ${sessionId}`);
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve checkout session ${sessionId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve checkout session: ${error.message}`,
      );
    }
  }

  /**
   * Create refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
  ): Promise<Stripe.Refund> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      this.logger.log(`Creating refund for payment intent: ${paymentIntentId}`);
      
      // First, verify the payment intent exists and is in a refundable state
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Check if payment intent has been successfully captured
      if (paymentIntent.status !== 'succeeded') {
        this.logger.warn(
          `Payment intent ${paymentIntentId} status is '${paymentIntent.status}', not 'succeeded'`,
        );
        throw new BadRequestException(
          `Payment cannot be refunded. Current Stripe status: '${paymentIntent.status}'. Only successfully captured payments can be refunded.`,
        );
      }
      
      // Check if there's a charge associated with the payment intent
      if (!paymentIntent.latest_charge) {
        this.logger.warn(
          `Payment intent ${paymentIntentId} has no associated charge`,
        );
        throw new BadRequestException(
          'Payment has no associated charge. It may not have been captured yet or the checkout was abandoned.',
        );
      }
      
      return await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create refund for ${paymentIntentId}: ${error.message}`,
        error.stack,
      );
      // If it's already a BadRequestException, re-throw it
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Provide more specific error messages for Stripe errors
      if (error.type === 'StripeInvalidRequestError') {
        if (error.message.includes('already been refunded')) {
          throw new BadRequestException(
            'This payment has already been refunded in Stripe.',
          );
        } else if (error.message.includes('No such payment_intent')) {
          throw new BadRequestException(
            'Payment intent not found in Stripe. It may have expired or been deleted.',
          );
        }
      }
      // Show the actual Stripe error for debugging
      throw new BadRequestException(
        `Stripe refund error: ${error.message}`,
      );
    }
  }

  /**
   * Construct webhook event from payload
   */
  async constructWebhookEvent(
    payload: Buffer | string,
    signature: string,
  ): Promise<Stripe.Event> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error(
        `Webhook signature verification failed: ${error.message}`,
      );
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  /**
   * Verify webhook signature (alias for constructWebhookEvent)
   */
  verifyWebhookSignature(
    body: string | Buffer,
    signature: string,
  ): Stripe.Event {
    return this.constructWebhookEvent(body, signature) as any;
  }
}
