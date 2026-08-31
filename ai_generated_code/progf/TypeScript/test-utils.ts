/**
 * Email testing utilities
 * Provides functions to test the email sending capabilities
 *
 * Supported via standard GitHub programming aids
 */

import { EmailRecipient, sendHtmlEmail, sendTextEmail } from "./resend";
import {
  TEST_EMAIL_SUBJECT,
  generateTestEmailHtml,
  generateTestEmailText,
} from "./templates/test";

/**
 * Send a test email to verify the email service configuration
 *
 * @param to - Recipient email address or object with name and email
 * @param useHtml - Whether to send HTML email (true) or plain text (false)
 * @returns Result of the email sending operation
 */
export const sendTestEmail = async (
  to: EmailRecipient | EmailRecipient[],
  useHtml = true
) => {
  // Handle single recipient
  const recipient = Array.isArray(to) ? to[0] : to;
  const recipientName = recipient.name || "there";

  if (useHtml) {
    // Send HTML test email
    const htmlContent = generateTestEmailHtml(recipientName);
    return sendHtmlEmail(to, TEST_EMAIL_SUBJECT, htmlContent);
  } else {
    // Send plain text test email
    const textContent = generateTestEmailText(recipientName);
    return sendTextEmail(to, TEST_EMAIL_SUBJECT, textContent);
  }
};
