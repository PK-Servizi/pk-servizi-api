import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { UserSubscriptionsService } from '../subscriptions/user-subscriptions.service';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly paymentsService: PaymentsService,
    // Injecting services directly for now. Ideally should be handled via a facade or specific methods.
  ) {}

  @Post()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEventFromPayload(signature, req.body);
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice,
          );
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed();
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted();
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated();
          break;
        default:
          this.logger.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      this.logger.error(
        `Error processing webhook event ${event.type}: ${error.message}`,
        error.stack,
      );
      // Do not throw error to Stripe if it's an internal processing error after verification,
      // to avoid Stripe retrying indefinitely if it's a bug code.
      // But for development, maybe useful.
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const userId = session.metadata?.userId;
    if (!userId) {
      this.logger.warn('Checkout session completed without userId in metadata');
      return;
    }

    if (session.mode === 'subscription') {
      // Subscription handling will mostly be done via invoice.payment_succeeded or customer.subscription.created/updated
      // But we can link the Stripe Customer ID here
      // Update user stripeCustomerId if needed
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const invoiceObj = invoice as any;
    if (!invoiceObj.subscription) return;

    const subscriptionId = invoiceObj.subscription as string;
    const stripeSubscription =
      await this.stripeService.retrieveSubscription(subscriptionId);
    const userId =
      (stripeSubscription.metadata as any)?.userId || invoice.metadata?.userId;

    // If we can't find userId from metadata, we might need to lookup by Stripe Customer ID
    // For now assume metadata is passed correctly from checkout session to subscription

    if (!userId) {
      // Try to find user subscription by stripeSubscriptionId if it exists
      // Or log warning
      this.logger.warn(
        `Invoice payment succeeded but no userId found for subscription ${subscriptionId}`,
      );
      return;
    }

    // Record Payment
    await this.paymentsService.create({
      userId: userId,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: 'completed',
      stripePaymentIntentId: invoiceObj.payment_intent as string,
      stripeChargeId: invoiceObj.charge as string,
      metadata: {
        invoiceId: invoice.id,
        subscriptionId: subscriptionId,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
      },
      subscriptionId: subscriptionId, // We might need to map this to internal ID if we have one
    });

    // Update Subscription Status if needed
    // Assuming UserSubscriptionsService has a method to find by Stripe ID and update
    // Or we create a new subscription record if it's the first payment

    // Simple logic:
    // Check if subscription exists in DB
    /* 
      const existingSub = await this.userSubscriptionsService.findByStripeId(subscriptionId);
      if (existingSub) {
          // extend validity
      } else {
          // create new
      }
      */
  }

  private async handleInvoicePaymentFailed() {
    // Record failed payment
    // Notify user
  }

  private async handleSubscriptionDeleted() {
    // Mark as cancelled in DB
  }

  private async handleSubscriptionUpdated() {
    // Update status, end date, etc.
    // const userId = subscription.metadata.userId;
    // if (userId) {
    // await this.userSubscriptionsService.syncStripeSubscription(userId, subscription);
    // }
  }
}
