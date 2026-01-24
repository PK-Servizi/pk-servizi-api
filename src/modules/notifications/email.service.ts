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
      subject: '🎉 Benvenuto in PK SERVIZI',
      title: `Benvenuto, ${fullName}!`,
      message:
        'Il tuo account è stato creato con successo. Ora puoi accedere a tutti i nostri servizi CAF.',
      actionUrl: `${this.getFrontendUrl()}/login`,
      actionText: 'Accedi al portale',
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '🔐 Reset Password - PK SERVIZI',
      title: 'Reset della Password',
      message:
        'Hai richiesto il reset della password. Clicca sul pulsante per reimpostare la password.',
      details: [{ label: 'Validità link', value: '1 ora' }],
      actionUrl: `${this.getFrontendUrl()}/reset-password?token=${token}`,
      actionText: 'Reimposta Password',
    });
  }

  async sendPasswordResetConfirmation(
    email: string,
    fullName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '✅ Password Modificata - PK SERVIZI',
      title: 'Password Modificata con Successo',
      message: `Ciao ${fullName}, la tua password è stata modificata con successo. Ora puoi accedere con la nuova password.`,
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
      subject: `✅ Richiesta ${serviceType} Inviata`,
      title: 'Richiesta Inviata con Successo',
      message: `Ciao ${fullName}, la tua richiesta per il servizio "${serviceType}" è stata inviata con successo. Ti contatteremo presto per l'elaborazione.`,
      details: [
        { label: 'ID Richiesta', value: `#${requestId}` },
        { label: 'Servizio', value: serviceType },
      ],
      actionUrl: `${this.getFrontendUrl()}/requests/${requestId}`,
      actionText: 'Visualizza Richiesta',
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
      subject: `🔔 Nuova Richiesta: ${serviceType}`,
      title: 'Nuova Richiesta da Gestire',
      message: `Un nuovo cliente ha inviato una richiesta di servizio che richiede la tua attenzione.`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Servizio', value: serviceType },
        { label: 'ID Richiesta', value: `#${requestId}` },
      ],
      actionUrl: `${this.getFrontendUrl()}/admin/requests/${requestId}`,
      actionText: 'Gestisci Richiesta',
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
      subject: `${emoji} Aggiornamento Richiesta ${serviceType}`,
      title: 'Stato Richiesta Aggiornato',
      message: `Ciao ${fullName}, ${statusMessage}`,
      details: [
        { label: 'ID Richiesta', value: `#${requestId}` },
        { label: 'Servizio', value: serviceType },
        { label: 'Nuovo Stato', value: newStatus },
      ],
      actionUrl: `${this.getFrontendUrl()}/requests/${requestId}`,
      actionText: 'Visualizza Dettagli',
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
      subject: '✅ Documento Approvato',
      title: 'Documento Approvato',
      message: `Ciao ${fullName}, il tuo documento "${documentName}" è stato approvato.`,
      details: [{ label: 'Documento', value: documentName }],
      actionUrl: requestId
        ? `${this.getFrontendUrl()}/requests/${requestId}`
        : undefined,
      actionText: 'Visualizza Richiesta',
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
      subject: '❌ Documento Rifiutato',
      title: 'Documento Rifiutato',
      message: `Ciao ${fullName}, il tuo documento "${documentName}" è stato rifiutato. Ti preghiamo di caricare un nuovo documento.`,
      details: [
        { label: 'Documento', value: documentName },
        { label: 'Motivo', value: reason },
      ],
      actionUrl: requestId
        ? `${this.getFrontendUrl()}/requests/${requestId}`
        : undefined,
      actionText: 'Carica Nuovo Documento',
    });
  }

  async sendDocumentUploadedToAdmin(
    customerName: string,
    documentName: string,
    requestId?: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '📄 Nuovo Documento Caricato',
      title: 'Nuovo Documento da Verificare',
      message: `Il cliente ${customerName} ha caricato un nuovo documento che richiede verifica.`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Documento', value: documentName },
      ],
      actionUrl: requestId
        ? `${this.getFrontendUrl()}/admin/requests/${requestId}`
        : undefined,
      actionText: 'Verifica Documento',
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
    const formattedDate = new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: email,
      subject: '✅ Appuntamento Confermato',
      title: 'Appuntamento Confermato',
      message: `Ciao ${fullName}, il tuo appuntamento è stato confermato con successo.`,
      details: [
        { label: 'Data e Ora', value: formattedDate },
        { label: 'Servizio', value: title },
      ],
      actionUrl: `${this.getFrontendUrl()}/appointments/${appointmentId}`,
      actionText: 'Visualizza Appuntamento',
    });
  }

  async sendAppointmentBookedToAdmin(
    customerName: string,
    appointmentDate: Date,
    title: string,
    appointmentId: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '🔔 Nuovo Appuntamento Prenotato',
      title: 'Nuovo Appuntamento',
      message: `Un cliente ha prenotato un nuovo appuntamento.`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Data e Ora', value: formattedDate },
        { label: 'Servizio', value: title },
      ],
      actionUrl: `${this.getFrontendUrl()}/admin/appointments/${appointmentId}`,
      actionText: 'Visualizza Appuntamento',
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
      new Intl.DateTimeFormat('it-IT', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(date);

    return this.sendEmail({
      to: email,
      subject: '📅 Appuntamento Riprogrammato',
      title: 'Appuntamento Riprogrammato',
      message: `Ciao ${fullName}, il tuo appuntamento è stato riprogrammato.`,
      details: [
        { label: 'Servizio', value: title },
        { label: 'Data Precedente', value: formatDate(oldDate) },
        { label: 'Nuova Data', value: formatDate(newDate) },
      ],
    });
  }

  async sendAppointmentCancelled(
    email: string,
    fullName: string,
    appointmentDate: Date,
    title: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: email,
      subject: '❌ Appuntamento Cancellato',
      title: 'Appuntamento Cancellato',
      message: `Ciao ${fullName}, il tuo appuntamento è stato cancellato.`,
      details: [
        { label: 'Data', value: formattedDate },
        { label: 'Servizio', value: title },
      ],
    });
  }

  async sendAppointmentCancelledToAdmin(
    customerName: string,
    appointmentDate: Date,
    title: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '🔔 Appuntamento Cancellato dal Cliente',
      title: 'Appuntamento Cancellato',
      message: `Il cliente ${customerName} ha cancellato un appuntamento.`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Data', value: formattedDate },
        { label: 'Servizio', value: title },
      ],
    });
  }

  async sendAppointmentReminder(
    email: string,
    fullName: string,
    appointmentDate: Date,
    title: string,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(appointmentDate);

    return this.sendEmail({
      to: email,
      subject: '⏰ Promemoria Appuntamento - Domani',
      title: 'Promemoria Appuntamento',
      message: `Ciao ${fullName}, ti ricordiamo che hai un appuntamento domani.`,
      details: [
        { label: 'Data e Ora', value: formattedDate },
        { label: 'Servizio', value: title },
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
      subject: '✅ Iscrizione Corso Confermata',
      title: 'Iscrizione Confermata',
      message: `Ciao ${fullName}, la tua iscrizione al corso "${courseTitle}" è stata confermata.`,
      details: [{ label: 'Corso', value: courseTitle }],
      actionUrl: `${this.getFrontendUrl()}/courses/${courseId}`,
      actionText: 'Visualizza Corso',
    });
  }

  async sendCourseEnrollmentCancelled(
    email: string,
    fullName: string,
    courseTitle: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '❌ Iscrizione Corso Cancellata',
      title: 'Iscrizione Cancellata',
      message: `Ciao ${fullName}, la tua iscrizione al corso "${courseTitle}" è stata cancellata.`,
      details: [{ label: 'Corso', value: courseTitle }],
    });
  }

  // ============= PAYMENT & SUBSCRIPTION EMAILS =============

  async sendSubscriptionActivated(
    email: string,
    fullName: string,
    planName: string,
    endDate: Date,
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'full',
    }).format(endDate);

    return this.sendEmail({
      to: email,
      subject: '✅ Abbonamento Attivato',
      title: 'Abbonamento Attivato',
      message: `Ciao ${fullName}, il tuo abbonamento "${planName}" è ora attivo!`,
      details: [
        { label: 'Piano', value: planName },
        { label: 'Scadenza', value: formattedDate },
      ],
      actionUrl: `${this.getFrontendUrl()}/subscriptions`,
      actionText: 'Gestisci Abbonamento',
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
      subject: '✅ Pagamento Ricevuto',
      title: 'Pagamento Confermato',
      message: `Ciao ${fullName}, abbiamo ricevuto il tuo pagamento di €${amount.toFixed(2)}.`,
      details: [{ label: 'Importo', value: `€${amount.toFixed(2)}` }],
      actionUrl: invoiceUrl,
      actionText: 'Scarica Ricevuta',
    });
  }

  async sendPaymentFailed(
    email: string,
    fullName: string,
    amount: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '❌ Pagamento Fallito',
      title: 'Pagamento Non Riuscito',
      message: `Ciao ${fullName}, il pagamento di €${amount.toFixed(2)} non è andato a buon fine. Ti preghiamo di aggiornare il metodo di pagamento.`,
      details: [{ label: 'Importo', value: `€${amount.toFixed(2)}` }],
      actionUrl: `${this.getFrontendUrl()}/payments`,
      actionText: 'Aggiorna Pagamento',
    });
  }

  async sendPaymentFailedToAdmin(
    customerName: string,
    customerEmail: string,
    amount: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '⚠️ Pagamento Fallito',
      title: 'Pagamento Fallito - Azione Richiesta',
      message: `Un pagamento del cliente ${customerName} non è andato a buon fine.`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Importo', value: `€${amount.toFixed(2)}` },
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
      subject: '❌ Abbonamento Cancellato',
      title: 'Abbonamento Cancellato',
      message: `Ciao ${fullName}, il tuo abbonamento "${planName}" è stato cancellato.`,
      details: [{ label: 'Piano', value: planName }],
    });
  }

  async sendSubscriptionCancelledToAdmin(
    customerName: string,
    planName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: this.getAdminEmail(),
      subject: '🔔 Abbonamento Cancellato',
      title: 'Abbonamento Cancellato',
      message: `Il cliente ${customerName} ha cancellato l'abbonamento "${planName}".`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Piano', value: planName },
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
      subject: `📄 Fattura ${invoiceNumber}`,
      title: 'Nuova Fattura Disponibile',
      message: `Ciao ${fullName}, la tua fattura è disponibile per il download.`,
      details: [
        { label: 'Numero Fattura', value: invoiceNumber },
        { label: 'Importo', value: `€${amount.toFixed(2)}` },
      ],
      actionUrl: pdfUrl,
      actionText: 'Scarica Fattura',
    });
  }

  // ============= GDPR EMAILS =============

  async sendGdprExportRequest(
    email: string,
    fullName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '📋 Richiesta Esportazione Dati Ricevuta',
      title: 'Richiesta GDPR Ricevuta',
      message: `Ciao ${fullName}, abbiamo ricevuto la tua richiesta di esportazione dati. Elaboreremo la richiesta entro 30 giorni.`,
    });
  }

  async sendGdprExportReady(
    email: string,
    fullName: string,
    downloadUrl: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '✅ I Tuoi Dati Sono Pronti',
      title: 'Esportazione Dati Completata',
      message: `Ciao ${fullName}, l'esportazione dei tuoi dati è completata. Il link per il download scadrà tra 7 giorni.`,
      details: [{ label: 'Validità', value: '7 giorni' }],
      actionUrl: downloadUrl,
      actionText: 'Scarica Dati',
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
      subject: '🔐 Account Creato - PK SERVIZI',
      title: 'Account Creato',
      message: `Ciao ${fullName}, un account è stato creato per te. Accedi con le credenziali fornite e modifica la password al primo accesso.`,
      details: [
        { label: 'Email', value: email },
        { label: 'Password Temporanea', value: tempPassword },
      ],
      actionUrl: `${this.getFrontendUrl()}/login`,
      actionText: 'Accedi',
    });
  }

  async sendUserSuspended(
    email: string,
    fullName: string,
    reason: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '⚠️ Account Sospeso',
      title: 'Account Sospeso',
      message: `Ciao ${fullName}, il tuo account è stato sospeso.`,
      details: [{ label: 'Motivo', value: reason }],
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
      title: 'Violazione SLA',
      message: `Una richiesta ha superato il tempo massimo di elaborazione.`,
      details: [
        { label: 'ID Richiesta', value: `#${requestId}` },
        { label: 'Servizio', value: serviceType },
        { label: 'Giorni in ritardo', value: `${daysOverdue}` },
      ],
      actionUrl: `${this.getFrontendUrl()}/admin/requests/${requestId}`,
      actionText: 'Gestisci Richiesta',
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
      subject: '⏰ Abbonamento in Scadenza',
      title: 'Abbonamento in Scadenza',
      message: `L'abbonamento di un cliente scadrà a breve.`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Piano', value: planName },
        { label: 'Giorni Rimanenti', value: `${daysRemaining}` },
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
      subject: '❌ Tentativi di Pagamento Esauriti',
      title: 'Tentativi di Pagamento Esauriti',
      message: `Tutti i tentativi di pagamento per il cliente ${customerName} sono falliti.`,
      details: [
        { label: 'Cliente', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Importo', value: `€${amount.toFixed(2)}` },
      ],
    });
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
