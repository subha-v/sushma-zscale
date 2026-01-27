// =============================================================================
// zScale Capital - Alpha Membership Welcome Email Template
// Add this function to your Google Apps Script
// =============================================================================

/**
 * Send the Alpha Membership Welcome Email when a user joins the Alpha Tier
 * Call this function when processing alpha_membership form submissions
 *
 * @param {Object} data - The form data containing user info
 * @param {string} data.firstName - User's first name
 * @param {string} data.email - User's email address
 */
function sendAlphaWelcomeEmail(data) {
  const firstName = data.firstName || 'Founder';
  const email = data.email;

  if (!email) {
    console.error('No email provided for Alpha welcome email');
    return false;
  }

  const subject = 'Welcome to the Inner Circle: zScale Alpha Activated';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to zScale Alpha</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0B; color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">

          <!-- Logo/Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <div style="font-size: 24px; font-weight: bold; color: #01F9C6;">
                zScale Capital
              </div>
              <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">
                Alpha Tier Access Confirmed
              </div>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td style="background-color: #1C1C1E; border-radius: 16px; border: 1px solid #2D2D2F; padding: 40px;">

              <!-- Status Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="display: inline-block; padding: 8px 20px; background-color: rgba(1, 249, 198, 0.1); border: 1px solid rgba(1, 249, 198, 0.3); border-radius: 100px; color: #01F9C6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  ✓ Institutional Grade
                </span>
              </div>

              <!-- Greeting -->
              <h1 style="font-size: 28px; font-weight: 700; color: #ffffff; margin: 0 0 20px 0; text-align: center;">
                Hi ${firstName},
              </h1>

              <p style="font-size: 16px; line-height: 1.6; color: #D1D5DB; margin: 0 0 25px 0;">
                You have officially cleared the gate. You are no longer just a "Founder" in the Dallas ecosystem; you are now a <strong style="color: #01F9C6;">zScale Alpha Member</strong>.
              </p>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(to right, transparent, #2D2D2F, transparent); margin: 30px 0;"></div>

              <!-- Access Section -->
              <h2 style="font-size: 18px; font-weight: 600; color: #01F9C6; margin: 0 0 20px 0;">
                Your Institutional Access is now live:
              </h2>

              <!-- The Portal -->
              <div style="background-color: #0A0A0B; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 3px solid #01F9C6;">
                <h3 style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0;">
                  📊 The Portal
                </h3>
                <p style="font-size: 14px; color: #9CA3AF; margin: 0; line-height: 1.5;">
                  You can now see the "Unfiltered" view of your Valuation and Equity benchmarks. Access dilution forecasts, cap table red flags, and sector-specific multiples.
                </p>
              </div>

              <!-- The Network -->
              <div style="background-color: #0A0A0B; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 3px solid #01F9C6;">
                <h3 style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0;">
                  🤝 The Network
                </h3>
                <p style="font-size: 14px; color: #9CA3AF; margin: 0; line-height: 1.5;">
                  Your Advisor matches are unlocked. You may now request direct warm introductions to our Sector Specialists and Shadow Capital Partners.
                </p>
              </div>

              <!-- The Standard -->
              <div style="background-color: #0A0A0B; border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 3px solid #01F9C6;">
                <h3 style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0;">
                  🗺️ The Standard
                </h3>
                <p style="font-size: 14px; color: #9CA3AF; margin: 0; line-height: 1.5;">
                  Your "Venture Math" roadmap is ready for review. Track your institutional readiness score and get personalized next steps.
                </p>
              </div>

              <!-- Database Update Notice -->
              <div style="background-color: rgba(1, 249, 198, 0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(1, 249, 198, 0.2); text-align: center;">
                <p style="font-size: 14px; color: #D1D5DB; margin: 0; line-height: 1.6;">
                  We have updated your status in the <strong style="color: #01F9C6;">zScale Master Database</strong>. Our partners are now monitoring your growth metrics for alignment with upcoming 2026 capital cycles.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://zscalecapital.com" style="display: inline-block; padding: 16px 32px; background-color: #01F9C6; color: #0A0A0B; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                  Access Your Alpha Dashboard
                </a>
              </div>

            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <p style="font-size: 18px; color: #01F9C6; font-weight: 600; margin: 0 0 10px 0;">
                Welcome to the standard.
              </p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">
                The zScale Capital Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #2D2D2F;">
              <p style="font-size: 12px; color: #6B7280; margin: 0 0 10px 0;">
                zScale Capital | Dallas, TX
              </p>
              <p style="font-size: 11px; color: #4B5563; margin: 0;">
                You received this email because you joined the zScale Alpha Tier membership.
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

  const plainTextBody = `
Welcome to the Inner Circle: zScale Alpha Activated

Hi ${firstName},

You have officially cleared the gate. You are no longer just a "Founder" in the Dallas ecosystem; you are now a zScale Alpha Member.

Your Institutional Access is now live:

THE PORTAL
You can now see the "Unfiltered" view of your Valuation and Equity benchmarks. Access dilution forecasts, cap table red flags, and sector-specific multiples.

THE NETWORK
Your Advisor matches are unlocked. You may now request direct warm introductions to our Sector Specialists and Shadow Capital Partners.

THE STANDARD
Your "Venture Math" roadmap is ready for review. Track your institutional readiness score and get personalized next steps.

---

We have updated your status in the zScale Master Database. Our partners are now monitoring your growth metrics for alignment with upcoming 2026 capital cycles.

Welcome to the standard.

The zScale Capital Team

---
zScale Capital | Dallas, TX
You received this email because you joined the zScale Alpha Tier membership.
  `;

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      body: plainTextBody,
      name: 'zScale Capital',
      replyTo: 'alpha@zscalecapital.com'
    });

    console.log('Alpha welcome email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending Alpha welcome email:', error);
    return false;
  }
}

// =============================================================================
// Example: Add this to your doPost function to handle Alpha membership signups
// =============================================================================

/*
// In your main doPost function, add a case for alpha_membership:

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    switch (data.formType) {
      case 'alpha_membership':
        // Save to spreadsheet
        saveToSheet('Alpha_Members', data);

        // Send welcome email
        sendAlphaWelcomeEmail(data);

        // Optionally notify the team
        sendTeamNotification({
          type: 'New Alpha Member',
          name: data.firstName + ' ' + data.lastName,
          email: data.email,
          company: data.companyName
        });
        break;

      // ... other cases
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
*/
