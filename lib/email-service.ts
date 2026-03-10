import { Resend } from 'resend'
import { Newsletter } from './newsletter'

const resend = new Resend(process.env.RESEND_API_KEY || '')

/**
 * Send newsletter via email using Resend
 * SECURITY: No user input in email template, sanitized content only
 */
export async function sendNewsletterEmail(
  email: string,
  name: string | undefined,
  newsletter: Newsletter
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const htmlContent = generateNewsletterHTML(newsletter, name)

    const response = await resend.emails.send({
      from: 'noreply@bigbrainmoves.com',
      to: email,
      subject: `📰 Big Brain Moves Daily Newsletter — ${newsletter.date}`,
      html: htmlContent,
      reply_to: 'support@bigbrainmoves.com',
    })

    if (response.error) {
      console.error('Resend error:', response.error)
      return {
        success: false,
        error: response.error.message,
      }
    }

    return {
      success: true,
      messageId: response.data?.id,
    }
  } catch (error) {
    console.error('Email send failed:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Generate HTML email template
 */
function generateNewsletterHTML(newsletter: Newsletter, name?: string): string {
  const recipientGreeting = name ? `Hi ${escapeHTML(name)},` : 'Hi there,'

  const sectionsHTML = Object.entries(newsletter.sections)
    .map(([sectionName, content]: any) => {
      const headline = content.headline ? `<h3>${escapeHTML(content.headline)}</h3>` : ''
      const tips = content.tips
        ? `<ul>${content.tips
            .map((tip: string) => `<li>${escapeHTML(tip)}</li>`)
            .join('')}</ul>`
        : ''
      const source = content.review_source
        ? `<p style="font-size: 12px; color: #999;">📚 ${escapeHTML(content.review_source)}</p>`
        : ''

      return `
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
          <h2 style="color: #0066cc; font-size: 18px; margin-bottom: 8px;">${escapeHTML(sectionName)}</h2>
          ${headline}
          ${tips}
          ${source}
        </div>
      `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Big Brain Moves Daily</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 16px;
          }
          h1 {
            margin: 0 0 8px 0;
            font-size: 28px;
          }
          .date {
            color: #999;
            font-size: 14px;
          }
          h2 {
            color: #0066cc;
            font-size: 18px;
            margin-top: 0;
          }
          h3 {
            font-size: 16px;
            margin: 12px 0 8px 0;
          }
          ul {
            margin: 12px 0;
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
          }
          .cta-button {
            display: inline-block;
            background: #0066cc;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧠 Big Brain Moves</h1>
            <p class="date">${escapeHTML(newsletter.date)}</p>
          </div>

          <p>${recipientGreeting}</p>
          <p>Your personalized daily newsletter is ready. Scroll down for actionable insights across your selected topics.</p>

          ${sectionsHTML}

          <div style="text-align: center;">
            <a href="https://bigbrainmoves.com/dashboard" class="cta-button">View Full Newsletter</a>
          </div>

          <div class="footer">
            <p>© 2026 Big Brain Moves. All rights reserved.</p>
            <p><a href="https://bigbrainmoves.com/unsubscribe" style="color: #0066cc;">Unsubscribe</a> | <a href="https://bigbrainmoves.com/preferences" style="color: #0066cc;">Manage Preferences</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Escape HTML entities to prevent XSS in email templates
 */
function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, char => map[char])
}

/**
 * Send daily newsletter to multiple users
 * RATE LIMIT: Use cron or queue system to avoid hitting Resend limits
 */
export async function sendDailyNewsletters(
  users: Array<{
    email: string
    name?: string
    newsletter: Newsletter
  }>
): Promise<{ sent: number; failed: number; errors: string[] }> {
  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (const user of users) {
    const result = await sendNewsletterEmail(user.email, user.name, user.newsletter)

    if (result.success) {
      sent++
    } else {
      failed++
      errors.push(`${user.email}: ${result.error}`)
    }

    // Rate limit: 1 email per second to avoid Resend quota
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return { sent, failed, errors }
}

/**
 * Send transactional email (signup confirmation, etc.)
 */
export async function sendTransactionalEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; messageId?: string }> {
  try {
    const response = await resend.emails.send({
      from: 'noreply@bigbrainmoves.com',
      to,
      subject,
      html: htmlContent,
    })

    return {
      success: !response.error,
      messageId: response.data?.id,
    }
  } catch (error) {
    console.error('Transactional email failed:', error)
    return { success: false }
  }
}
