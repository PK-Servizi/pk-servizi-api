import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  title: string;
  message: string;
  details?: { label: string; value: string }[];
  actionUrl?: string;
  actionText?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });
  }

  /**
   * Universal email template - Professional and consistent design
   */
  private getEmailTemplate(data: Omit<EmailData, 'to' | 'subject'>): string {
    const detailsHtml = data.details
      ? data.details
          .map(
            (d) => `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">
            <strong>${d.label}:</strong> ${d.value}
          </td>
        </tr>
      `,
          )
          .join('')
      : '';

    const actionHtml = data.actionUrl
      ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.actionUrl}" 
           style="background-color: #2563eb; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;
                  font-weight: 600;">
          ${data.actionText || 'Visualizza'}
        </a>
      </div>
    `
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">
                      PK SERVIZI
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                      ${data.title}
                    </h2>
                    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      ${data.message}
                    </p>
                    
                    ${
                      detailsHtml
                        ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f9fafb; border-radius: 6px; padding: 15px;">
                      ${detailsHtml}
                    </table>
                    `
                        : ''
                    }
                    
                    ${actionHtml}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                      Cordiali saluti,<br>
                      <strong>Il team PK SERVIZI</strong>
                    </p>
                    <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                      Questa è un'email automatica, non rispondere a questo messaggio.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * Core email sending method
   */
  async sendEmail(data: EmailData): Promise<boolean> {
    if (!this.configService.get<boolean>('NOTIFICATION_ENABLED')) {
      this.logger.warn('Notifications disabled - email not sent');
      return false;
    }

    try {
      const html = this.getEmailTemplate(data);
      const mailOptions = {
        from: {
          name:
            this.configService.get<string>('EMAIL_FROM_NAME') || 'PK SERVIZI',
          address: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
        },
        to: data.to,
        subject: data.subject,
        html,
        text: this.stripHtml(data.message),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${data.to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}: ${error.message}`);
      return false;
    }
  }

  // ============= Helper Methods =============

  getAdminEmail(): string {
    return (
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@pkservizi.com'
    );
  }

  private getFrontendUrl(): string {
    return (
      this.configService.get<string>('FRONTEND_URL') || 'https://pkservizi.com'
    );
  }

  // ============= AUTHENTICATION EMAILS =============

  async sendWelcomeEmail(email: string, fullName: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '🎉 Welcome to PK SERVIZI',
      title: `Welcome, ${fullName}!`,
      message:
        'Your account has been created successfully. You can now access all our CAF services.',
      actionUrl: `${this.getFrontendUrl()}/login`,
      actionText: 'Access Portal',
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '🔐 Password Reset - PK SERVIZI',
      title: 'Password Reset',
      message:
        'You have requested a password reset. Click the button below to reset your password.',
      details: [{ label: 'Link validity', value: '1 hour' }],
      actionUrl: `${this.getFrontendUrl()}/reset-password?token=${token}`,
      actionText: 'Reset Password',
    });
  }

  async sendPasswordResetConfirmation(
    email: string,
    fullName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '✅ Password Changed - PK SERVIZI',
      title: 'Password Changed Successfully',
      message: `Hello ${fullName}, your password has been changed successfully. You can now login with your new password.`,
    });
  }

  // ============= SERVICE REQUEST EMAILS =============

  async sendServiceRequestSubmitted(
    email: string,
    fullName: string,
    requestId: string,
    serviceType: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `✅ ${serviceType} Request Submitted`,
      title: 'Request Submitted Successfully',
      message: `Hello ${fullName}, your request for "${serviceType}" service has been submitted successfully. We will contact you soon for processing.`,
      details: [
        { label: 'Request ID', value: `#${requestId}` },
        { label: 'Service', value: serviceType },
      ],
      actionUrl: `${this.getFrontendUrl()}/requests/${requestId}`,
      actionText: 'View Request',
    });
  }

  async sendServiceRequestSubmittedToAdmin(
    customerName: string,
    customerEmail: string,
    requestId: string,
    serviceType: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: `🔔 New Request: ${serviceType}`,
      title: 'New Request to Handle',
      message: `A new customer has submitted a service request that requires your attention.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Service', value: serviceType },
        { label: 'Request ID', value: `#${requestId}` },
      ],
      actionUrl: `${this.getFrontendUrl()}/admin/requests/${requestId}`,
      actionText: 'Manage Request',
    });
  }

  async sendServiceRequestStatusUpdate(
    email: string,
    fullName: string,
    requestId: string,
    serviceType: string,
    newStatus: string,
    statusMessage: string,
  ): Promise<boolean> {
    const statusEmojis = {
      in_review: '🔍',
      missing_documents: '📄',
      completed: '✅',
      rejected: '❌',
    };
    const emoji = statusEmojis[newStatus] || '📋';

    return this.sendEmail({
      to: email,
      subject: `${emoji} ${serviceType} Request Update`,
      title: 'Request Status Updated',
      message: `Hello ${fullName}, ${statusMessage}`,
      details: [
        { label: 'Request ID', value: `#${requestId}` },
        { label: 'Service', value: serviceType },
        { label: 'New Status', value: newStatus },
      ],
      actionUrl: `${this.getFrontendUrl()}/requests/${requestId}`,
      actionText: 'View Details',
    });
  }

  // ============= DOCUMENT EMAILS =============

  async sendDocumentApproved(
    email: string,
    fullName: string,
    documentName: string,
    requestId?: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '✅ Document Approved',
      title: 'Document Approved',
      message: `Hello ${fullName}, your document "${documentName}" has been approved.`,
      details: [{ label: 'Document', value: documentName }],
      actionUrl: requestId
        ? `${this.getFrontendUrl()}/requests/${requestId}`
        : undefined,
      actionText: 'View Request',
    });
  }

  async sendDocumentRejected(
    email: string,
    fullName: string,
    documentName: string,
    reason: string,
    requestId?: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '❌ Document Rejected',
      title: 'Document Rejected',
      message: `Hello ${fullName}, your document "${documentName}" has been rejected. Please upload a new document.`,
      details: [
        { label: 'Document', value: documentName },
        { label: 'Reason', value: reason },
      ],
      actionUrl: requestId
        ? `${this.getFrontendUrl()}/requests/${requestId}`
        : undefined,
      actionText: 'Upload New Document',
    });
  }

  async sendDocumentUploadedToAdmin(
    customerName: string,
    documentName: string,
    requestId?: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '📄 New Document Uploaded',
      title: 'New Document to Verify',
      message: `Customer ${customerName} has uploaded a new document that requires verification.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Document', value: documentName },
      ],
      actionUrl: requestId
        ? `${this.getFrontendUrl()}/admin/requests/${requestId}`
        : undefined,
      actionText: 'Verify Document',
    });
  }

  // ============= APPOINTMENT EMAILS =============

  async sendAppointmentConfirmation(
    email: string,
    fullName: string,
    appointmentDate: Date,
    title: string,
    appointmentId: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: email,
      subject: '✅ Appointment Confirmed',
      title: 'Appointment Confirmed',
      message: `Hello ${fullName}, your appointment has been confirmed successfully.`,
      details: [
        { label: 'Date & Time', value: formattedDate },
        { label: 'Service', value: title },
      ],
      actionUrl: `${this.getFrontendUrl()}/appointments/${appointmentId}`,
      actionText: 'View Appointment',
    });
  }

  async sendAppointmentBookedToAdmin(
    customerName: string,
    appointmentDate: Date,
    title: string,
    appointmentId: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '🔔 New Appointment Booked',
      title: 'New Appointment',
      message: `A customer has booked a new appointment.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Date & Time', value: formattedDate },
        { label: 'Service', value: title },
      ],
      actionUrl: `${this.getFrontendUrl()}/admin/appointments/${appointmentId}`,
      actionText: 'View Appointment',
    });
  }

  async sendAppointmentRescheduled(
    email: string,
    fullName: string,
    oldDate: Date,
    newDate: Date,
    title: string,
  ): Promise<boolean> {
    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(date);

    return this.sendEmail({
      to: email,
      subject: '📅 Appointment Rescheduled',
      title: 'Appointment Rescheduled',
      message: `Hello ${fullName}, your appointment has been rescheduled.`,
      details: [
        { label: 'Service', value: title },
        { label: 'Previous Date', value: formatDate(oldDate) },
        { label: 'New Date', value: formatDate(newDate) },
      ],
    });
  }

  async sendAppointmentCancelled(
    email: string,
    fullName: string,
    appointmentDate: Date,
    title: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: email,
      subject: '❌ Appointment Cancelled',
      title: 'Appointment Cancelled',
      message: `Hello ${fullName}, your appointment has been cancelled.`,
      details: [
        { label: 'Date', value: formattedDate },
        { label: 'Service', value: title },
      ],
    });
  }

  async sendAppointmentCancelledToAdmin(
    customerName: string,
    appointmentDate: Date,
    title: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '🔔 Appointment Cancelled by Customer',
      title: 'Appointment Cancelled',
      message: `Customer ${customerName} has cancelled an appointment.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Date', value: formattedDate },
        { label: 'Service', value: title },
      ],
    });
  }

  async sendAppointmentReminder(
    email: string,
    fullName: string,
    appointmentDate: Date,
    title: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: email,
      subject: '⏰ Appointment Reminder - Tomorrow',
      title: 'Appointment Reminder',
      message: `Hello ${fullName}, this is a reminder that you have an appointment tomorrow.`,
      details: [
        { label: 'Date & Time', value: formattedDate },
        { label: 'Service', value: title },
      ],
    });
  }

  // ============= COURSE EMAILS =============

  async sendCourseEnrollment(
    email: string,
    fullName: string,
    courseTitle: string,
    courseId: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '✅ Course Enrollment Confirmed',
      title: 'Enrollment Confirmed',
      message: `Hello ${fullName}, your enrollment in the course "${courseTitle}" has been confirmed.`,
      details: [{ label: 'Course', value: courseTitle }],
      actionUrl: `${this.getFrontendUrl()}/courses/${courseId}`,
      actionText: 'View Course',
    });
  }

  async sendCourseEnrollmentCancelled(
    email: string,
    fullName: string,
    courseTitle: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '❌ Course Enrollment Cancelled',
      title: 'Enrollment Cancelled',
      message: `Hello ${fullName}, your enrollment in the course "${courseTitle}" has been cancelled.`,
      details: [{ label: 'Course', value: courseTitle }],
    });
  }

  // ============= PAYMENT & SUBSCRIPTION EMAILS =============

  async sendSubscriptionActivated(
    email: string,
    fullName: string,
    planName: string,
    endDate: Date,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
    }).format(endDate);

    return this.sendEmail({
      to: email,
      subject: '✅ Subscription Activated',
      title: 'Subscription Activated',
      message: `Hello ${fullName}, your "${planName}" subscription is now active!`,
      details: [
        { label: 'Plan', value: planName },
        { label: 'Expires', value: formattedDate },
      ],
      actionUrl: `${this.getFrontendUrl()}/subscriptions`,
      actionText: 'Manage Subscription',
    });
  }

  async sendPaymentSuccess(
    email: string,
    fullName: string,
    amount: number,
    invoiceUrl?: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '✅ Payment Received',
      title: 'Payment Confirmed',
      message: `Hello ${fullName}, we have received your payment of €${amount.toFixed(2)}.`,
      details: [{ label: 'Amount', value: `€${amount.toFixed(2)}` }],
      actionUrl: invoiceUrl,
      actionText: 'Download Receipt',
    });
  }

  async sendPaymentFailed(
    email: string,
    fullName: string,
    amount: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '❌ Payment Failed',
      title: 'Payment Failed',
      message: `Hello ${fullName}, the payment of €${amount.toFixed(2)} was not successful. Please update your payment method.`,
      details: [{ label: 'Amount', value: `€${amount.toFixed(2)}` }],
      actionUrl: `${this.getFrontendUrl()}/payments`,
      actionText: 'Update Payment',
    });
  }

  async sendPaymentFailedToAdmin(
    customerName: string,
    customerEmail: string,
    amount: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '⚠️ Payment Failed',
      title: 'Payment Failed - Action Required',
      message: `A payment from customer ${customerName} was not successful.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Amount', value: `€${amount.toFixed(2)}` },
      ],
    });
  }

  async sendSubscriptionCancelled(
    email: string,
    fullName: string,
    planName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '❌ Subscription Cancelled',
      title: 'Subscription Cancelled',
      message: `Hello ${fullName}, your "${planName}" subscription has been cancelled.`,
      details: [{ label: 'Plan', value: planName }],
    });
  }

  async sendSubscriptionCancelledToAdmin(
    customerName: string,
    planName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '🔔 Subscription Cancelled',
      title: 'Subscription Cancelled',
      message: `Customer ${customerName} has cancelled the "${planName}" subscription.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Plan', value: planName },
      ],
    });
  }

  async sendInvoice(
    email: string,
    fullName: string,
    invoiceNumber: string,
    amount: number,
    pdfUrl: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `📄 Invoice ${invoiceNumber}`,
      title: 'New Invoice Available',
      message: `Hello ${fullName}, your invoice is available for download.`,
      details: [
        { label: 'Invoice Number', value: invoiceNumber },
        { label: 'Amount', value: `€${amount.toFixed(2)}` },
      ],
      actionUrl: pdfUrl,
      actionText: 'Download Invoice',
    });
  }

  // ============= GDPR EMAILS =============

  async sendGdprExportRequest(
    email: string,
    fullName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '📋 Data Export Request Received',
      title: 'GDPR Request Received',
      message: `Hello ${fullName}, we have received your data export request. We will process the request within 30 days.`,
    });
  }

  async sendGdprExportReady(
    email: string,
    fullName: string,
    downloadUrl: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '✅ Your Data is Ready',
      title: 'Data Export Completed',
      message: `Hello ${fullName}, your data export is complete. The download link will expire in 7 days.`,
      details: [{ label: 'Validity', value: '7 days' }],
      actionUrl: downloadUrl,
      actionText: 'Download Data',
    });
  }

  // ============= ADMIN USER MANAGEMENT EMAILS =============

  async sendUserCreatedByAdmin(
    email: string,
    fullName: string,
    tempPassword: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '🔐 Account Created - PK SERVIZI',
      title: 'Account Created',
      message: `Hello ${fullName}, an account has been created for you. Login with the provided credentials and change your password on first access.`,
      details: [
        { label: 'Email', value: email },
        { label: 'Temporary Password', value: tempPassword },
      ],
      actionUrl: `${this.getFrontendUrl()}/login`,
      actionText: 'Login',
    });
  }

  async sendUserSuspended(
    email: string,
    fullName: string,
    reason: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '⚠️ Account Suspended',
      title: 'Account Suspended',
      message: `Hello ${fullName}, your account has been suspended.`,
      details: [{ label: 'Reason', value: reason }],
    });
  }

  // ============= SYSTEM ALERT EMAILS =============

  async sendSlaViolationAlert(
    requestId: string,
    serviceType: string,
    daysOverdue: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '⚠️ SLA Violation Alert',
      title: 'SLA Violation',
      message: `A request has exceeded the maximum processing time.`,
      details: [
        { label: 'Request ID', value: `#${requestId}` },
        { label: 'Service', value: serviceType },
        { label: 'Days Overdue', value: `${daysOverdue}` },
      ],
      actionUrl: `${this.getFrontendUrl()}/admin/requests/${requestId}`,
      actionText: 'Manage Request',
    });
  }

  async sendSubscriptionExpiringAlert(
    customerName: string,
    customerEmail: string,
    planName: string,
    daysRemaining: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '⏰ Subscription Expiring Soon',
      title: 'Subscription Expiring',
      message: `A customer's subscription will expire soon.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Plan', value: planName },
        { label: 'Days Remaining', value: `${daysRemaining}` },
      ],
    });
  }

  async sendPaymentRetryExhausted(
    customerName: string,
    customerEmail: string,
    amount: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '❌ Payment Retry Attempts Exhausted',
      title: 'Payment Retry Exhausted',
      message: `All payment attempts for customer ${customerName} have failed.`,
      details: [
        { label: 'Customer', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Amount', value: `€${amount.toFixed(2)}` },
      ],
    });
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
