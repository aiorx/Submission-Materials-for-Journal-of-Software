/**
 * Email testing utilities
 * Provides functions to test the email sending capabilities
 *
 * Supported via standard GitHub programming aids
 */

var EmailRecipient = require('./resend').EmailRecipient;
var sendHtmlEmail = require('./resend').sendHtmlEmail;
var sendTextEmail = require('./resend').sendTextEmail;
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
var sendTestEmail = async function (
  to: EmailRecipient | EmailRecipient[],
  useHtml = true
) {
  // Handle single recipient
  var recipient = Array.isArray(to) ? to[0] : to;
  var recipientName = recipient.name || "there";

  if (useHtml) {
    // Send HTML test email
    var htmlContent = generateTestEmailHtml(recipientName);
    return sendHtmlEmail(to, TEST_EMAIL_SUBJECT, htmlContent);
  } else {
    // Send plain text test email
    var textContent = generateTestEmailText(recipientName);
    return sendTextEmail(to, TEST_EMAIL_SUBJECT, textContent);
  }
};
