/**
 * ============================================================================
 * zScale Capital - Advisor Match Email Template
 * ============================================================================
 *
 * USAGE: Copy this entire function into your Google Apps Script.
 * Call it like: const emailHtml = getAdvisorMatchEmailTemplate(data);
 * Then use: MailApp.sendEmail({ to: email, subject: subject, htmlBody: emailHtml });
 *
 * REQUIRED DATA OBJECT:
 * {
 *   firstName: "John",
 *   companyName: "Acme Inc",
 *   sector: "SaaS",
 *   timestamp: "2026-01-28",
 *   advisor1: { icon: "☁️", title: "Enterprise SaaS GTM Leader", subtitle: "Former CRO...", credibility: "Scaled ARR..." },
 *   advisor2: { title: "Platform Architecture Specialist" },
 *   advisor3: { title: "Strategic Exit Advisor" },
 *   membershipUrl: "https://zscalecapital.com/membership"  // Use this from payload
 * }
 */

function getAdvisorMatchEmailTemplate(data) {
  // Default values
  const firstName = data.firstName || 'Founder';
  const companyName = data.companyName || 'your company';
  const sector = data.sector ? data.sector.charAt(0).toUpperCase() + data.sector.slice(1) : 'Technology';
  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Use the membershipUrl from payload, fallback to production URL
  const membershipUrl = data.membershipUrl || data.emailNextStepUrl || 'https://zscalecapital.com/membership';

  // Advisor data with defaults
  const advisor1 = data.advisor1 || {
    icon: '💼',
    title: 'Industry Specialist',
    subtitle: 'Senior Executive with deep sector expertise',
    credibility: 'Proven track record in your industry'
  };

  const advisor2Title = data.advisor2?.title || 'Strategic Advisor';
  const advisor3Title = data.advisor3?.title || 'Growth Specialist';

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Your Advisor Matches Are Ready | zScale Capital</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: dark; supported-color-schemes: dark; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0A0A0B; }
    @media only screen and (max-width: 620px) {
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">

  <!-- Preview Text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    Your high-tier advisor matches have been identified. 3 strategic connections await verification.
  </div>

  <!-- Email Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0A0A0B;">
    <tr>
      <td align="center" style="padding: 40px 10px;">

        <!-- Main Content Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%;">

          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 0 0 40px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #01F9C6 0%, #00D4AA 100%); padding: 16px 20px; border-radius: 12px;">
                    <span style="font-family: 'Arial Black', Arial, sans-serif; font-size: 32px; font-weight: 900; color: #0A0A0B; letter-spacing: -2px;">Z</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; font-size: 14px; color: #6B7280; letter-spacing: 3px; text-transform: uppercase;">zScale Capital</p>
            </td>
          </tr>

          <!-- Status Bar -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #111113; border: 1px solid #1F1F23; border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td>
                          <span style="display: inline-block; width: 8px; height: 8px; background-color: #01F9C6; border-radius: 50%; margin-right: 12px; vertical-align: middle;"></span>
                          <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #01F9C6; text-transform: uppercase; letter-spacing: 1px; vertical-align: middle;">Diagnostic Complete</span>
                        </td>
                        <td align="right">
                          <span style="font-size: 12px; color: #6B7280;">${timestamp}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td style="background-color: #111113; border: 1px solid #1F1F23; border-radius: 16px; padding: 40px;" class="mobile-padding">

              <!-- Greeting -->
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 600; color: #FFFFFF; line-height: 1.3;">
                ${firstName}, Your Matches Are Ready
              </h1>
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #D1D5DB; line-height: 1.6;">
                Based on your <span style="color: #FFFFFF; font-weight: 500;">${sector}</span> focus and <span style="color: #FFFFFF; font-weight: 500;">${companyName}</span>'s current stage, we've identified high-tier advisor matches within the Dallas-Fort Worth ecosystem.
              </p>

              <!-- Divider -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-bottom: 1px solid #1F1F23; padding-bottom: 32px;"></td>
                </tr>
              </table>

              <!-- Match Summary Label -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 2px;">Match Summary</p>
                  </td>
                </tr>
              </table>

              <!-- Match 1 - Unlocked -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0A0A0B; border: 1px solid #01F9C6; border-radius: 12px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="50" valign="top">
                          <div style="width: 44px; height: 44px; background: linear-gradient(135deg, rgba(1, 249, 198, 0.2) 0%, #111113 100%); border: 1px solid rgba(1, 249, 198, 0.3); border-radius: 10px; text-align: center; line-height: 44px; font-size: 20px;">
                            ${advisor1.icon}
                          </div>
                        </td>
                        <td style="padding-left: 16px;">
                          <span style="display: inline-block; padding: 4px 10px; background-color: rgba(1, 249, 198, 0.1); border: 1px solid rgba(1, 249, 198, 0.3); border-radius: 4px; font-size: 10px; color: #01F9C6; text-transform: uppercase; letter-spacing: 1px;">Match 1 &bull; Active</span>
                          <p style="margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; color: #FFFFFF;">${advisor1.title}</p>
                          <p style="margin: 0 0 12px 0; font-size: 13px; color: #9CA3AF;">${advisor1.subtitle}</p>
                          <p style="margin: 0; font-size: 12px; color: #01F9C6;">${advisor1.credibility}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Match 2 - Locked -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0A0A0B; border: 1px solid #1F1F23; border-radius: 12px; margin-bottom: 16px; opacity: 0.7;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="50" valign="top">
                          <div style="width: 44px; height: 44px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 10px; text-align: center; line-height: 44px; font-size: 16px; color: #6B7280;">
                            &#128274;
                          </div>
                        </td>
                        <td style="padding-left: 16px;">
                          <span style="display: inline-block; padding: 4px 10px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 4px; font-size: 10px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Match 2 &bull; Locked</span>
                          <p style="margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; color: #6B7280;">${advisor2Title}</p>
                          <p style="margin: 0; font-size: 13px; color: #4B5563;">Requires Alpha Membership to unlock</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Match 3 - Locked -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0A0A0B; border: 1px solid #1F1F23; border-radius: 12px; margin-bottom: 32px; opacity: 0.7;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="50" valign="top">
                          <div style="width: 44px; height: 44px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 10px; text-align: center; line-height: 44px; font-size: 16px; color: #6B7280;">
                            &#128274;
                          </div>
                        </td>
                        <td style="padding-left: 16px;">
                          <span style="display: inline-block; padding: 4px 10px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 4px; font-size: 10px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Match 3 &bull; Locked</span>
                          <p style="margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; color: #6B7280;">${advisor3Title}</p>
                          <p style="margin: 0; font-size: 13px; color: #4B5563;">Requires Alpha Membership to unlock</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-bottom: 1px solid #1F1F23; padding-bottom: 32px;"></td>
                </tr>
              </table>

              <!-- Next Step Section -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td style="background: linear-gradient(135deg, rgba(1, 249, 198, 0.05) 0%, rgba(1, 249, 198, 0.1) 50%, rgba(1, 249, 198, 0.05) 100%); border: 1px solid rgba(1, 249, 198, 0.2); border-radius: 12px; padding: 24px; text-align: center;">

                    <div style="width: 48px; height: 48px; margin: 0 auto 16px auto; background-color: rgba(1, 249, 198, 0.1); border: 1px solid rgba(1, 249, 198, 0.3); border-radius: 50%; line-height: 48px; text-align: center; font-size: 20px;">
                      &#128272;
                    </div>

                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #01F9C6; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Next Step</p>

                    <p style="margin: 0 0 20px 0; font-size: 15px; color: #D1D5DB; line-height: 1.6;">
                      To unlock warm introductions to these advisors, a <span style="color: #FFFFFF; font-weight: 600;">zScale Alpha Membership</span> is required to verify your data room readiness.
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 50px; background-color: #01F9C6;">
                          <a href="${membershipUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: 600; color: #0A0A0B; text-decoration: none; border-radius: 50px;">
                            Join Alpha Tier Membership &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 16px 0 0 0; font-size: 12px; color: #6B7280;">
                      Unlock all 3 advisors + direct warm introduction requests
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Dallas Exit Gap Stat -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td style="background-color: #0A0A0B; border: 1px solid #1F1F23; border-radius: 12px; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.6;">
                      <span style="color: #FFFFFF; font-weight: 500;">The Dallas Exit Gap:</span> Founders with institutional credentialing close <span style="color: #01F9C6; font-weight: 600;">3.2x faster</span> than those without warm network access.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 0 0 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 8px 12px; border: 1px solid #1F1F23; border-radius: 8px;">
                          <span style="font-family: 'Arial Black', Arial, sans-serif; font-size: 16px; font-weight: 900; color: #01F9C6; letter-spacing: -1px;">Z</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 16px 0 8px 0; font-size: 13px; color: #9CA3AF; font-weight: 500;">zScale Capital</p>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #4B5563;">Dallas, Texas</p>
                    <p style="margin: 0 0 24px 0; font-size: 11px; color: #4B5563; letter-spacing: 1px;">Dallas Grit. Institutional Standards.</p>

                    <p style="margin: 0; font-size: 11px; color: #4B5563;">
                      <a href="https://zscalecapital.com" style="color: #6B7280; text-decoration: none;">Website</a>
                      <span style="color: #2D2D33; padding: 0 8px;">|</span>
                      <a href="${membershipUrl}" style="color: #6B7280; text-decoration: none;">Alpha Membership</a>
                      <span style="color: #2D2D33; padding: 0 8px;">|</span>
                      <a href="mailto:hello@zscalecapital.com" style="color: #6B7280; text-decoration: none;">Contact</a>
                    </p>

                    <p style="margin: 24px 0 0 0; font-size: 10px; color: #3D3D43;">
                      &copy; 2026 zScale Capital. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}


/**
 * ============================================================================
 * EXAMPLE USAGE IN YOUR EXISTING APPS SCRIPT
 * ============================================================================
 *
 * Replace your current email sending code with something like this:
 */

function sendAdvisorMatchEmail_EXAMPLE(payload) {
  // Get sector-specific advisor data (you may already have this logic)
  const sectorAdvisors = getSectorAdvisors(payload.sector);

  // Build the data object for the template
  const emailData = {
    firstName: payload.firstName,
    companyName: payload.companyName,
    sector: payload.sector,
    timestamp: payload.timestamp,
    membershipUrl: payload.membershipUrl || payload.emailNextStepUrl || 'https://zscalecapital.com/membership',
    advisor1: {
      icon: sectorAdvisors.primary.icon,
      title: sectorAdvisors.primary.title,
      subtitle: sectorAdvisors.primary.subtitle,
      credibility: sectorAdvisors.primary.credibility
    },
    advisor2: { title: sectorAdvisors.locked[0]?.title || 'Strategic Advisor' },
    advisor3: { title: sectorAdvisors.locked[1]?.title || 'Growth Specialist' }
  };

  // Generate the HTML email
  const emailHtml = getAdvisorMatchEmailTemplate(emailData);

  // Send the email
  MailApp.sendEmail({
    to: payload.email,
    subject: `${payload.firstName}, Your Advisor Matches Are Ready | zScale Capital`,
    htmlBody: emailHtml
  });
}


/**
 * Helper function to get sector-specific advisors
 * (Customize this based on your existing advisor data structure)
 */
function getSectorAdvisors(sector) {
  const SECTOR_ADVISORS = {
    'saas': {
      primary: {
        icon: '☁️',
        title: 'Enterprise SaaS GTM Leader',
        subtitle: 'Former CRO, B2B Software Company',
        credibility: 'Scaled ARR from $2M to $50M'
      },
      locked: [
        { title: 'Platform Architecture Specialist' },
        { title: 'SaaS M&A Advisor' }
      ]
    },
    'fintech': {
      primary: {
        icon: '📊',
        title: 'FinTech Regulatory Specialist',
        subtitle: 'Former Chief Compliance Officer, Major Bank',
        credibility: 'Led compliance for $50B+ in transactions'
      },
      locked: [
        { title: 'Payments Infrastructure Expert' },
        { title: 'Banking Partnership Strategist' }
      ]
    },
    'healthcare': {
      primary: {
        icon: '🏥',
        title: 'Healthcare & MedTech Advisor',
        subtitle: 'Former Physician Advisor to Major Hospital Networks',
        credibility: 'Guided 12 MedTech companies through FDA approval'
      },
      locked: [
        { title: 'Digital Health Strategist' },
        { title: 'Healthcare M&A Specialist' }
      ]
    },
    'manufacturing': {
      primary: {
        icon: '🏭',
        title: 'Manufacturing & Supply Chain Veteran',
        subtitle: '30-Year Veteran of Fortune 500 Operations',
        credibility: 'Built 3 exits in industrial automation'
      },
      locked: [
        { title: 'Industrial Automation Specialist' },
        { title: 'Supply Chain Finance Expert' }
      ]
    },
    'aerospace': {
      primary: {
        icon: '✈️',
        title: 'Aerospace & Defense Specialist',
        subtitle: 'Former VP of Operations, Major Defense Contractor',
        credibility: '25+ years in defense tech ecosystems'
      },
      locked: [
        { title: 'DoD Contracts Specialist' },
        { title: 'Space Tech Commercialization Expert' }
      ]
    },
    'energy': {
      primary: {
        icon: '⚡',
        title: 'Energy & CleanTech Specialist',
        subtitle: 'Former VP Operations, Major Energy Company',
        credibility: '20+ years in Texas energy markets'
      },
      locked: [
        { title: 'Renewable Project Finance Expert' },
        { title: 'Grid Integration Specialist' }
      ]
    }
  };

  // Default to manufacturing if sector not found
  const sectorKey = sector?.toLowerCase() || 'manufacturing';
  return SECTOR_ADVISORS[sectorKey] || SECTOR_ADVISORS['manufacturing'];
}
