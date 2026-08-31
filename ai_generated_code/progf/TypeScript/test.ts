/**
 * Test email template
 * Simple template for testing the Resend email service integration
 *
 * Aided with basic GitHub coding tools
 */

/**
 * Generates a simple test email content in plain text format
 *
 * @param recipientName - Name of the recipient
 * @returns Plain text email content
 */
export const generateTestEmailText = (recipientName: string): string => {
  return `Hello ${recipientName},

This is a test email from the Dashi platform.

This email confirms that the email service integration is working correctly.

Thank you for using Dashi!

Best regards,
The Dashi Team`;
};

/**
 * Generates a simple test email content in HTML format
 *
 * @param recipientName - Name of the recipient
 * @returns HTML email content
 */
export const generateTestEmailHtml = (recipientName: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dashi Test Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #FF6B00;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 4px 4px 0 0;
    }
    .content {
      padding: 20px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 4px 4px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Dashi</h1>
  </div>
  <div class="content">
    <p>Hello ${recipientName},</p>
    <p>This is a test email from the <strong>Dashi</strong> platform.</p>
    <p>This email confirms that the email service integration is working correctly.</p>
    <p>Thank you for using Dashi!</p>
    <p>Best regards,<br>The Dashi Team</p>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Dashi. All rights reserved.</p>
  </div>
</body>
</html>`;
};

/**
 * Default test email subject
 */
export const TEST_EMAIL_SUBJECT = "Dashi Email Service Test";
