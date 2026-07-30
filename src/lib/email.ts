import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface SecurityAlertContext {
  ip?: string;
  userAgent?: string;
  when: Date;
}

export async function sendSecurityAlert(toEmail: string, ctx: SecurityAlertContext): Promise<void> {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping security alert (dev mode). Would have sent:', {
      toEmail,
      ctx,
    });
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Gauth Security <security@example.com>',
    to: toEmail,
    subject: 'Your vault was locked after multiple failed unlock attempts',
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>Vault locked</h2>
        <p>We locked your gauth vault after 3 failed unlock attempts.</p>
        <ul>
          <li><strong>When:</strong> ${ctx.when.toISOString()}</li>
          <li><strong>IP:</strong> ${ctx.ip ?? 'unknown'}</li>
          <li><strong>Device:</strong> ${ctx.userAgent ?? 'unknown'}</li>
        </ul>
        <p>If this wasn't you, sign in and reset your vault pattern immediately.</p>
      </div>
    `,
  });
}
