/**
 * ============================================================================
 * zScale Capital - Google Apps Script (FINAL VERSION)
 * ============================================================================
 *
 * SETUP STEPS:
 * 1. Replace SPREADSHEET_ID below with your actual Google Sheet ID
 * 2. Save the script (Ctrl+S / Cmd+S)
 * 3. Click "Run" → select "authorizeScript" → Run it
 * 4. A popup will ask for permissions - click "Review Permissions" → Allow
 * 5. Deploy: Deploy → New Deployment → Web App → Anyone → Deploy
 * 6. Copy the URL to your frontend
 *
 * ============================================================================
 */

// ⚠️ IMPORTANT: Replace this with your actual Google Sheet ID
// Find it in your sheet URL: https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// ============================================================================
// MAIN HANDLER - Receives all form submissions
// ============================================================================

function doPost(e) {
  try {
    // Parse the incoming data
    const payload = JSON.parse(e.postData.contents);

    // Log what we received (check in View → Logs)
    console.log('Received form type:', payload.formType);
    console.log('Email:', payload.email);

    // Handle based on form type
    if (payload.formType === 'advisor_match') {
      handleAdvisorMatch(payload);
    } else if (payload.formType === 'build_application') {
      handleBuildApplication(payload);
    } else {
      // Log all other submissions to Master sheet
      logToSheet('Master_Registry', payload);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Submission received'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error:', error.message);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('zScale API is running').setMimeType(ContentService.MimeType.TEXT);
}

// ============================================================================
// ADVISOR MATCH HANDLER - Logs data AND sends email
// ============================================================================

function handleAdvisorMatch(payload) {
  // 1. Log to spreadsheet
  logToSheet('Advisor_Matches', payload);
  logToSheet('Master_Registry', payload);

  // 2. Send the email
  sendAdvisorEmail(payload);
}

function logToSheet(sheetName, payload) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(sheetName);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Add row with key data
    sheet.appendRow([
      new Date().toISOString(),
      payload.formType || '',
      payload.email || '',
      payload.firstName || '',
      payload.lastName || '',
      payload.companyName || '',
      payload.sector || '',
      payload.source || '',
      JSON.stringify(payload)
    ]);

    console.log('Logged to sheet:', sheetName);
  } catch (error) {
    console.error('Error logging to sheet:', error.message);
  }
}

// ============================================================================
// EMAIL FUNCTION - Sends the branded Advisor Match email
// ============================================================================

function sendAdvisorEmail(payload) {
  try {
    const email = payload.email;
    const firstName = payload.firstName || 'Founder';
    const companyName = payload.companyName || 'your company';
    const sector = payload.sector || 'technology';
    const membershipUrl = payload.membershipUrl || 'https://zscalecapital.com/membership';

    // Get advisor based on sector
    const advisor = getAdvisorForSector(sector);

    // Build the HTML email
    const htmlBody = buildEmailHTML(firstName, companyName, sector, advisor, membershipUrl);

    // Send the email
    MailApp.sendEmail({
      to: email,
      subject: firstName + ', Your Advisor Matches Are Ready | zScale Capital',
      htmlBody: htmlBody,
      name: 'zScale Capital',
      replyTo: 'hello@zscalecapital.com'
    });

    console.log('✅ Email sent successfully to:', email);

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
}

// ============================================================================
// SECTOR ADVISORS
// ============================================================================

function getAdvisorForSector(sector) {
  const advisors = {
    'saas': { icon: '☁️', title: 'Enterprise SaaS GTM Leader', subtitle: 'Former CRO, B2B Software Company', credibility: 'Scaled ARR from $2M to $50M', locked1: 'Platform Architecture Specialist', locked2: 'SaaS M&A Advisor' },
    'fintech': { icon: '📊', title: 'FinTech Regulatory Specialist', subtitle: 'Former Chief Compliance Officer', credibility: 'Led compliance for $50B+ in transactions', locked1: 'Payments Infrastructure Expert', locked2: 'Banking Partnership Strategist' },
    'healthcare': { icon: '🏥', title: 'Healthcare & MedTech Advisor', subtitle: 'Former Physician Advisor', credibility: 'Guided 12 MedTech companies through FDA', locked1: 'Digital Health Strategist', locked2: 'Healthcare M&A Specialist' },
    'manufacturing': { icon: '🏭', title: 'Manufacturing & Supply Chain Veteran', subtitle: '30-Year Fortune 500 Operations Veteran', credibility: 'Built 3 exits in industrial automation', locked1: 'Industrial Automation Specialist', locked2: 'Supply Chain Finance Expert' },
    'aerospace': { icon: '✈️', title: 'Aerospace & Defense Specialist', subtitle: 'Former VP of Operations, Defense Contractor', credibility: '25+ years in defense tech ecosystems', locked1: 'DoD Contracts Specialist', locked2: 'Space Tech Expert' },
    'energy': { icon: '⚡', title: 'Energy & CleanTech Specialist', subtitle: 'Former VP Operations, Major Energy Company', credibility: '20+ years in Texas energy markets', locked1: 'Renewable Project Finance Expert', locked2: 'Grid Integration Specialist' },
    'ecommerce': { icon: '🛒', title: 'E-Commerce & DTC Strategist', subtitle: 'Former VP Growth, E-Commerce Platform', credibility: 'Scaled multiple brands to $100M+', locked1: 'Supply Chain Expert', locked2: 'Marketplace Advisor' },
    'proptech': { icon: '🏢', title: 'PropTech & Real Estate Innovator', subtitle: 'Former CTO, Commercial Real Estate Firm', credibility: 'Built platforms managing $5B+ in assets', locked1: 'Real Estate Finance Specialist', locked2: 'Smart Building Expert' }
  };

  const key = (sector || 'manufacturing').toLowerCase();
  return advisors[key] || advisors['manufacturing'];
}

// ============================================================================
// EMAIL HTML TEMPLATE
// ============================================================================

function buildEmailHTML(firstName, companyName, sector, advisor, membershipUrl) {
  const sectorDisplay = sector.charAt(0).toUpperCase() + sector.slice(1);
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Advisor Matches | zScale Capital</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #01F9C6, #00D4AA); padding: 16px 20px; border-radius: 12px; display: inline-block;">
                <span style="font-family: Arial Black, sans-serif; font-size: 32px; font-weight: 900; color: #0A0A0B;">Z</span>
              </div>
              <p style="margin: 16px 0 0 0; font-size: 14px; color: #6B7280; letter-spacing: 3px;">ZSCALE CAPITAL</p>
            </td>
          </tr>

          <!-- Status Bar -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111113; border: 1px solid #1F1F23; border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 24px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #01F9C6; border-radius: 50%; margin-right: 12px;"></span>
                    <span style="font-family: monospace; font-size: 12px; color: #01F9C6; text-transform: uppercase;">Diagnostic Complete</span>
                    <span style="float: right; font-size: 12px; color: #6B7280;">${today}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #111113; border: 1px solid #1F1F23; border-radius: 16px; padding: 40px;">

              <h1 style="margin: 0 0 8px 0; font-size: 28px; color: #FFFFFF;">${firstName}, Your Matches Are Ready</h1>
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #D1D5DB; line-height: 1.6;">
                Based on your <span style="color: #FFFFFF; font-weight: 600;">${sectorDisplay}</span> focus and <span style="color: #FFFFFF; font-weight: 600;">${companyName}</span>'s current stage, we've identified high-tier advisor matches within the Dallas-Fort Worth ecosystem.
              </p>

              <hr style="border: none; border-top: 1px solid #1F1F23; margin: 32px 0;">

              <p style="margin: 0 0 16px 0; font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 2px;">Match Summary</p>

              <!-- Match 1 - Active -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #01F9C6; border-radius: 12px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" valign="top">
                          <div style="width: 44px; height: 44px; background: linear-gradient(135deg, rgba(1,249,198,0.2), #111113); border: 1px solid rgba(1,249,198,0.3); border-radius: 10px; text-align: center; line-height: 44px; font-size: 20px;">${advisor.icon}</div>
                        </td>
                        <td>
                          <span style="display: inline-block; padding: 4px 10px; background-color: rgba(1,249,198,0.1); border: 1px solid rgba(1,249,198,0.3); border-radius: 4px; font-size: 10px; color: #01F9C6; text-transform: uppercase;">Match 1 • Active</span>
                          <p style="margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; color: #FFFFFF;">${advisor.title}</p>
                          <p style="margin: 0 0 12px 0; font-size: 13px; color: #9CA3AF;">${advisor.subtitle}</p>
                          <p style="margin: 0; font-size: 12px; color: #01F9C6;">${advisor.credibility}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Match 2 - Locked -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #1F1F23; border-radius: 12px; margin-bottom: 16px; opacity: 0.7;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" valign="top">
                          <div style="width: 44px; height: 44px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 10px; text-align: center; line-height: 44px; font-size: 16px; color: #6B7280;">🔒</div>
                        </td>
                        <td>
                          <span style="display: inline-block; padding: 4px 10px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 4px; font-size: 10px; color: #6B7280; text-transform: uppercase;">Match 2 • Locked</span>
                          <p style="margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; color: #6B7280;">${advisor.locked1}</p>
                          <p style="margin: 0; font-size: 13px; color: #4B5563;">Requires Alpha Membership to unlock</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Match 3 - Locked -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B; border: 1px solid #1F1F23; border-radius: 12px; margin-bottom: 32px; opacity: 0.7;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" valign="top">
                          <div style="width: 44px; height: 44px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 10px; text-align: center; line-height: 44px; font-size: 16px; color: #6B7280;">🔒</div>
                        </td>
                        <td>
                          <span style="display: inline-block; padding: 4px 10px; background-color: #1F1F23; border: 1px solid #2D2D33; border-radius: 4px; font-size: 10px; color: #6B7280; text-transform: uppercase;">Match 3 • Locked</span>
                          <p style="margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; color: #6B7280;">${advisor.locked2}</p>
                          <p style="margin: 0; font-size: 13px; color: #4B5563;">Requires Alpha Membership to unlock</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #1F1F23; margin: 32px 0;">

              <!-- Next Step CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(1,249,198,0.05), rgba(1,249,198,0.1), rgba(1,249,198,0.05)); border: 1px solid rgba(1,249,198,0.2); border-radius: 12px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="width: 48px; height: 48px; margin: 0 auto 16px auto; background-color: rgba(1,249,198,0.1); border: 1px solid rgba(1,249,198,0.3); border-radius: 50%; line-height: 48px; font-size: 20px;">🔐</div>
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #01F9C6; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Next Step</p>
                    <p style="margin: 0 0 20px 0; font-size: 15px; color: #D1D5DB; line-height: 1.6;">
                      To unlock warm introductions to these advisors, a <span style="color: #FFFFFF; font-weight: 600;">zScale Alpha Membership</span> is required to verify your data room readiness.
                    </p>
                    <a href="${membershipUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; background-color: #01F9C6; color: #0A0A0B; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 50px;">Join Alpha Tier Membership →</a>
                    <p style="margin: 16px 0 0 0; font-size: 12px; color: #6B7280;">Unlock all 3 advisors + direct warm introduction requests</p>
                  </td>
                </tr>
              </table>

              <!-- Dallas Exit Gap -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px; background-color: #0A0A0B; border: 1px solid #1F1F23; border-radius: 12px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #9CA3AF;">
                      <span style="color: #FFFFFF; font-weight: 500;">The Dallas Exit Gap:</span> Founders with institutional credentialing close <span style="color: #01F9C6; font-weight: 600;">3.2x faster</span> than those without warm network access.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 40px; text-align: center;">
              <div style="display: inline-block; padding: 8px 12px; border: 1px solid #1F1F23; border-radius: 8px;">
                <span style="font-family: Arial Black, sans-serif; font-size: 16px; font-weight: 900; color: #01F9C6;">Z</span>
              </div>
              <p style="margin: 16px 0 8px 0; font-size: 13px; color: #9CA3AF;">zScale Capital</p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #4B5563;">Dallas, Texas</p>
              <p style="margin: 0 0 24px 0; font-size: 11px; color: #4B5563;">Dallas Grit. Institutional Standards.</p>
              <p style="margin: 0; font-size: 11px; color: #4B5563;">
                <a href="https://zscalecapital.com" style="color: #6B7280; text-decoration: none;">Website</a> |
                <a href="${membershipUrl}" style="color: #6B7280; text-decoration: none;">Alpha Membership</a> |
                <a href="mailto:hello@zscalecapital.com" style="color: #6B7280; text-decoration: none;">Contact</a>
              </p>
              <p style="margin: 24px 0 0 0; font-size: 10px; color: #3D3D43;">© 2026 zScale Capital. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ============================================================================
// BUILD APPLICATION HANDLER - Logs data AND sends email
// ============================================================================

function handleBuildApplication(payload) {
  // 1. Log to Build_Applications sheet
  logBuildApplication(payload);

  // 2. Also log to Master_Registry
  logToSheet('Master_Registry', payload);

  // 3. Send confirmation email to applicant
  sendBuildApplicationEmail(payload);

  // 4. Send notification to team (optional)
  sendTeamBuildNotification(payload);
}

function logBuildApplication(payload) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Build_Applications');

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Build_Applications');
      // Add headers
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'LinkedIn',
        'Role',
        'University/Company',
        'Technical Skills',
        'Has Startup Idea',
        'Description',
        'Timeline',
        'Status'
      ]);
    }

    // Add row with application data
    sheet.appendRow([
      new Date().toISOString(),
      payload.name || '',
      payload.email || '',
      payload.linkedin || '',
      payload.role || '',
      payload.school || '',
      payload.skills || '',
      payload.hasIdea || '',
      payload.description || '',
      payload.timeline || '',
      'New'
    ]);

    console.log('Logged build application to sheet for:', payload.email);
  } catch (error) {
    console.error('Error logging build application:', error.message);
  }
}

function sendBuildApplicationEmail(payload) {
  try {
    const email = payload.email;
    const name = payload.name || 'Builder';

    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0B;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #01F9C6, #00D4AA); padding: 16px 20px; border-radius: 12px; display: inline-block;">
                <span style="font-family: Arial Black, sans-serif; font-size: 32px; font-weight: 900; color: #0A0A0B;">Z</span>
              </div>
              <p style="margin: 16px 0 0 0; font-size: 14px; color: #6B7280; letter-spacing: 3px;">ZSCALE CAPITAL</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #111113; border: 1px solid #1F1F23; border-radius: 16px; padding: 40px;">

              <h1 style="margin: 0 0 8px 0; font-size: 28px; color: #01F9C6;">Application Received! 🎉</h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #D1D5DB; line-height: 1.6;">
                Hi ${name},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #D1D5DB; line-height: 1.6;">
                Thank you for applying to build with zScale Capital! We've received your application and are excited to learn more about your vision.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(1,249,198,0.05), rgba(1,249,198,0.1)); border: 1px solid rgba(1,249,198,0.2); border-radius: 12px; margin: 24px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #01F9C6; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Next Steps</p>
                    <ul style="margin: 0; padding-left: 20px; color: #D1D5DB; font-size: 14px; line-height: 1.8;">
                      <li>Our team will review your application within <strong style="color: #FFFFFF;">48 hours</strong></li>
                      <li>We'll reach out via email if there's a good fit</li>
                      <li>If selected, we'll schedule a call to discuss your project in detail</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #1F1F23; margin: 32px 0;">

              <p style="margin: 0 0 16px 0; font-size: 14px; color: #9CA3AF;">
                In the meantime, explore more resources on our platform:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <a href="https://zscalecapital.com/ecosystem-map" style="color: #01F9C6; text-decoration: none; font-size: 14px;">→ Dallas Venture Ecosystem Map</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <a href="https://zscalecapital.com/tools/investor-tier-list" style="color: #01F9C6; text-decoration: none; font-size: 14px;">→ Investor Tier List</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <a href="https://zscalecapital.com/tools/equity-calculator" style="color: #01F9C6; text-decoration: none; font-size: 14px;">→ Equity Calculator</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 32px 0 0 0; font-size: 14px; color: #D1D5DB;">
                Best regards,<br>
                <strong style="color: #FFFFFF;">The zScale Capital Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #9CA3AF;">zScale Capital</p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #4B5563;">Dallas, Texas</p>
              <p style="margin: 0 0 24px 0; font-size: 11px; color: #4B5563;">Dallas Grit. Institutional Standards.</p>
              <p style="margin: 0; font-size: 11px; color: #4B5563;">
                <a href="https://zscalecapital.com" style="color: #6B7280; text-decoration: none;">Website</a> |
                <a href="mailto:hello@zscalecapital.com" style="color: #6B7280; text-decoration: none;">Contact</a>
              </p>
              <p style="margin: 24px 0 0 0; font-size: 10px; color: #3D3D43;">© 2026 zScale Capital. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    MailApp.sendEmail({
      to: email,
      subject: name + ', Your Application Has Been Received | zScale Capital',
      htmlBody: htmlBody,
      name: 'zScale Capital',
      replyTo: 'hello@zscalecapital.com'
    });

    console.log('✅ Build application confirmation email sent to:', email);

  } catch (error) {
    console.error('❌ Error sending build application email:', error.message);
  }
}

function sendTeamBuildNotification(payload) {
  try {
    // Update this with your team's email address
    const teamEmail = 'hello@zscalecapital.com';

    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
    <h2 style="color: #01F9C6; margin-top: 0;">New Build Application Received</h2>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold; width: 200px;">Name</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.name || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Email</td>
        <td style="padding: 12px; border: 1px solid #ddd;"><a href="mailto:${payload.email}">${payload.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">LinkedIn</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.linkedin ? '<a href="' + payload.linkedin + '">' + payload.linkedin + '</a>' : 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Role</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.role || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">University/Company</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.school || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Technical Skills</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.skills || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Has Startup Idea</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.hasIdea || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Timeline</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.timeline || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold; vertical-align: top;">Description</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${payload.description || 'Not provided'}</td>
      </tr>
    </table>

    <p style="margin-top: 30px;">
      <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}"
         style="display: inline-block; background-color: #01F9C6; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View in Spreadsheet →
      </a>
    </p>
  </div>
</body>
</html>`;

    MailApp.sendEmail({
      to: teamEmail,
      subject: 'New Build Application: ' + (payload.name || 'Unknown'),
      htmlBody: htmlBody,
      name: 'zScale Application System'
    });

    console.log('✅ Team notification sent for build application');

  } catch (error) {
    console.error('❌ Error sending team notification:', error.message);
  }
}

// ============================================================================
// AUTHORIZATION FUNCTION - Run this FIRST to grant permissions
// ============================================================================

function authorizeScript() {
  // This function triggers the authorization prompt
  // Run it once from the Apps Script editor

  console.log('Checking permissions...');

  // Test spreadsheet access
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet access: OK - ' + ss.getName());
  } catch (e) {
    console.log('❌ Spreadsheet access: FAILED - ' + e.message);
    console.log('Make sure you updated SPREADSHEET_ID at the top of the script!');
  }

  // Test email access
  try {
    const remaining = MailApp.getRemainingDailyQuota();
    console.log('✅ Email access: OK - ' + remaining + ' emails remaining today');
  } catch (e) {
    console.log('❌ Email access: FAILED - ' + e.message);
  }

  console.log('');
  console.log('If you see any FAILED messages, fix the issues and run again.');
  console.log('If all OK, you can now deploy the web app!');
}

// ============================================================================
// TEST FUNCTION - Send a test email to yourself
// ============================================================================

function testSendEmail() {
  // ⚠️ Change this to YOUR email address for testing
  const testEmail = 'YOUR_EMAIL_HERE@example.com';

  const testPayload = {
    email: testEmail,
    firstName: 'Test',
    lastName: 'User',
    companyName: 'Test Company',
    sector: 'saas',
    membershipUrl: 'https://zscalecapital.com/membership'
  };

  sendAdvisorEmail(testPayload);
  console.log('Test email sent to: ' + testEmail);
}
