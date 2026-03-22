/**
 * ============================================================================
 * zScale Capital - Master Google Apps Script
 * ============================================================================
 *
 * This script handles all form submissions from the zScale Capital website.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Replace the entire code with this file
 * 3. Create a Google Sheet with the following tabs:
 *    - Master_Registry
 *    - IRI_Audits
 *    - Advisor_Matches
 *    - Newsletter_Subscribers
 *    - Tool_Access
 *    - Venture_Benchmarks
 *    - Ecosystem_Map
 * 4. Update the SPREADSHEET_ID constant below with your sheet ID
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy the deployment URL to your frontend config
 *
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID

const SHEET_NAMES = {
  MASTER: 'Master_Registry',
  IRI: 'IRI_Audits',
  ADVISOR: 'Advisor_Matches',
  NEWSLETTER: 'Newsletter_Subscribers',
  TOOL_ACCESS: 'Tool_Access',
  VENTURE_BENCHMARKS: 'Venture_Benchmarks',
  ECOSYSTEM_MAP: 'Ecosystem_Map',
  EQUITY: 'Equity_Calculations',
  VALUATION: 'Valuation_Benchmarks'
};

const FORM_TYPES = {
  READINESS_INDEX: 'readiness_index',
  ADVISOR_MATCH: 'advisor_match',
  NEWSLETTER: 'newsletter',
  TOOL_ACCESS: 'tool_access',
  VENTURE_BENCHMARKS: 'venture_benchmarks',
  ECOSYSTEM_MAP: 'ecosystem_map',
  VALUATION_TOOL: 'valuation_tool',
  EQUITY_EVALUATOR: 'equity_evaluator',
  SHADOW_CAPITAL: 'shadow_capital',
  LIBRARY_SIGNUP: 'library_signup'
};

// Email configuration
const EMAIL_CONFIG = {
  FROM_NAME: 'zScale Capital',
  REPLY_TO: 'hello@zscalecapital.com',
  // Use production URL for emails (not localhost)
  MEMBERSHIP_URL: 'https://zscalecapital.com/membership'
};


// ============================================================================
// MAIN ENTRY POINT - doPost
// ============================================================================

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const formType = payload.formType;

    // Log the submission
    console.log('Received submission:', formType, payload.email);

    // Route to appropriate handler based on form type
    switch (formType) {
      case FORM_TYPES.READINESS_INDEX:
        return handleIRISubmission(payload);

      case FORM_TYPES.ADVISOR_MATCH:
        return handleAdvisorMatchSubmission(payload);

      case FORM_TYPES.NEWSLETTER:
        return handleNewsletterSubmission(payload);

      case FORM_TYPES.TOOL_ACCESS:
        return handleToolAccessSubmission(payload);

      case FORM_TYPES.VENTURE_BENCHMARKS:
        return handleVentureBenchmarksSubmission(payload);

      case FORM_TYPES.ECOSYSTEM_MAP:
      case FORM_TYPES.SHADOW_CAPITAL:
        return handleEcosystemMapSubmission(payload);

      case FORM_TYPES.VALUATION_TOOL:
        return handleValuationToolSubmission(payload);

      case FORM_TYPES.EQUITY_EVALUATOR:
        return handleEquityEvaluatorSubmission(payload);

      case FORM_TYPES.LIBRARY_SIGNUP:
        return handleLibrarySignupSubmission(payload);

      default:
        // Unknown form type - log to master registry
        logToMasterRegistry(payload);
        return createResponse(true, 'Submission logged');
    }

  } catch (error) {
    console.error('Error processing submission:', error);
    return createResponse(false, error.message);
  }
}

// For testing via GET request
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'zScale Capital API is running',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}


// ============================================================================
// FORM HANDLERS
// ============================================================================

/**
 * Handle IRI (Investment Readiness Index) submissions
 */
function handleIRISubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.IRI);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.companyName,
    payload.sector,
    payload.totalScore,
    payload.vector1PmfEvidence,
    payload.vector2UnitEconomics,
    payload.vector3TeamAdvisors,
    payload.vector4Infrastructure,
    payload.vector5CapitalPosition,
    payload.penaltyApplied ? 'Yes' : 'No',
    payload.penaltyAmount,
    payload.recommendedWorkshop,
    payload.workshopPriority,
    payload.source,
    // Raw answers
    payload.pmfCustomerValidation,
    payload.pmfRetention,
    payload.pmfOrganicGrowth,
    payload.metricUnitEconomicsKnowledge,
    payload.metricCacLtv,
    payload.metricRevenueModel,
    payload.teamFounderBackground,
    payload.teamCompleteness,
    payload.teamAdvisorNetwork,
    payload.infraLegalStructure,
    payload.infraFinancialTracking,
    payload.infraDataRoom,
    payload.capitalFundraisingExp,
    payload.capitalInvestorRelations
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  // Send IRI results email (optional)
  // sendIRIResultsEmail(payload);

  return createResponse(true, 'IRI submission recorded');
}

/**
 * Handle Advisor Match submissions - SENDS BRANDED EMAIL
 */
function handleAdvisorMatchSubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.ADVISOR);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.companyName,
    payload.currentStage,
    payload.sector,
    payload.source,
    // Diagnostic answers
    payload.pmfCustomerValidation,
    payload.pmfRevenueModel,
    payload.pmfCompetitiveAdvantage,
    payload.financialRunway,
    payload.financialFundraisingReady,
    payload.financialMetrics,
    payload.teamCoFounders,
    payload.teamKeyHires,
    payload.teamAdvisoryGaps,
    payload.advisorCurrentNetwork,
    payload.advisorNeededExpertise,
    payload.advisorEngagementStyle,
    'Email Sent' // Status
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  // Send the branded Advisor Match email
  sendAdvisorMatchEmail(payload);

  return createResponse(true, 'Advisor match submission recorded and email sent');
}

/**
 * Handle Newsletter subscriptions
 */
function handleNewsletterSubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.NEWSLETTER);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.email,
    payload.firstName || '',
    payload.lastName || '',
    payload.source || 'newsletter-signup',
    'Active'
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  return createResponse(true, 'Newsletter subscription recorded');
}

/**
 * Handle Tool Access submissions (Valuation, Equity tools)
 */
function handleToolAccessSubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.TOOL_ACCESS);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.toolName || payload.tool,
    payload.source,
    payload.leadTag || ''
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  return createResponse(true, 'Tool access recorded');
}

/**
 * Handle Venture Benchmarks PDF downloads
 */
function handleVentureBenchmarksSubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.VENTURE_BENCHMARKS);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.leadSource || payload.source,
    payload.leadTag,
    payload.assetDownloaded
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  return createResponse(true, 'Venture benchmarks download recorded');
}

/**
 * Handle Ecosystem Map / Shadow Capital downloads
 */
function handleEcosystemMapSubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.ECOSYSTEM_MAP);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.companyName || '',
    payload.source,
    payload.formType === FORM_TYPES.SHADOW_CAPITAL ? 'Shadow Capital' : 'Ecosystem Map'
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  return createResponse(true, 'Ecosystem map submission recorded');
}

/**
 * Handle Valuation Tool submissions
 */
function handleValuationToolSubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.VALUATION);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.source,
    payload.leadTag || 'Valuation_Tool'
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  return createResponse(true, 'Valuation tool access recorded');
}

/**
 * Handle Equity Evaluator submissions
 */
function handleEquityEvaluatorSubmission(payload) {
  const sheet = getSheet(SHEET_NAMES.EQUITY);

  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.source,
    payload.leadTag || 'Equity_Evaluator'
  ];

  sheet.appendRow(row);
  logToMasterRegistry(payload);

  return createResponse(true, 'Equity evaluator access recorded');
}

/**
 * Handle Library/Briefing signups
 */
function handleLibrarySignupSubmission(payload) {
  logToMasterRegistry(payload);
  return createResponse(true, 'Library signup recorded');
}


// ============================================================================
// MASTER REGISTRY - Central log of all submissions
// ============================================================================

function logToMasterRegistry(payload) {
  try {
    const sheet = getSheet(SHEET_NAMES.MASTER);

    const row = [
      payload.timestamp || new Date().toISOString(),
      payload.formType,
      payload.email,
      payload.firstName || '',
      payload.lastName || '',
      payload.companyName || '',
      payload.sector || '',
      payload.source || '',
      JSON.stringify(payload) // Full payload for reference
    ];

    sheet.appendRow(row);
  } catch (error) {
    console.error('Error logging to master registry:', error);
  }
}


// ============================================================================
// EMAIL FUNCTIONS
// ============================================================================

/**
 * Send branded Advisor Match email
 */
function sendAdvisorMatchEmail(payload) {
  try {
    // Get sector-specific advisors
    const advisors = getSectorAdvisors(payload.sector);

    // Use membershipUrl from payload, or fall back to production URL
    const membershipUrl = payload.membershipUrl || payload.emailNextStepUrl || EMAIL_CONFIG.MEMBERSHIP_URL;

    // Build email data
    const emailData = {
      firstName: payload.firstName || 'Founder',
      companyName: payload.companyName || 'your company',
      sector: payload.sector,
      timestamp: payload.timestamp,
      membershipUrl: membershipUrl,
      advisor1: advisors.primary,
      advisor2: { title: advisors.locked[0]?.title || 'Strategic Advisor' },
      advisor3: { title: advisors.locked[1]?.title || 'Growth Specialist' }
    };

    // Generate HTML email
    const emailHtml = getAdvisorMatchEmailTemplate(emailData);

    // Send email
    MailApp.sendEmail({
      to: payload.email,
      subject: `${payload.firstName || 'Founder'}, Your Advisor Matches Are Ready | zScale Capital`,
      htmlBody: emailHtml,
      name: EMAIL_CONFIG.FROM_NAME,
      replyTo: EMAIL_CONFIG.REPLY_TO
    });

    console.log('Advisor match email sent to:', payload.email);

  } catch (error) {
    console.error('Error sending advisor match email:', error);
  }
}


// ============================================================================
// SECTOR-SPECIFIC ADVISOR DATA
// ============================================================================

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
    },
    'ecommerce': {
      primary: {
        icon: '🛒',
        title: 'E-Commerce & DTC Strategist',
        subtitle: 'Former VP Growth, Major E-Commerce Platform',
        credibility: 'Scaled multiple brands to $100M+ revenue'
      },
      locked: [
        { title: 'Supply Chain Optimization Expert' },
        { title: 'Marketplace Strategy Advisor' }
      ]
    },
    'proptech': {
      primary: {
        icon: '🏢',
        title: 'PropTech & Real Estate Innovator',
        subtitle: 'Former CTO, Commercial Real Estate Firm',
        credibility: 'Built platforms managing $5B+ in assets'
      },
      locked: [
        { title: 'Real Estate Finance Specialist' },
        { title: 'Smart Building Technology Expert' }
      ]
    }
  };

  const sectorKey = sector?.toLowerCase() || 'manufacturing';
  return SECTOR_ADVISORS[sectorKey] || SECTOR_ADVISORS['manufacturing'];
}


// ============================================================================
// ADVISOR MATCH EMAIL TEMPLATE
// ============================================================================

function getAdvisorMatchEmailTemplate(data) {
  const firstName = data.firstName || 'Founder';
  const companyName = data.companyName || 'your company';
  const sector = data.sector ? data.sector.charAt(0).toUpperCase() + data.sector.slice(1) : 'Technology';
  const timestamp = data.timestamp
    ? new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const membershipUrl = data.membershipUrl || EMAIL_CONFIG.MEMBERSHIP_URL;

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


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get or create a sheet by name
 */
function getSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log('Created new sheet:', sheetName);
  }

  return sheet;
}

/**
 * Create a JSON response
 */
function createResponse(success, message) {
  return ContentService.createTextOutput(JSON.stringify({
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}


// ============================================================================
// TEST FUNCTIONS (for debugging in Apps Script editor)
// ============================================================================

/**
 * Test the Advisor Match email template
 */
function testAdvisorMatchEmail() {
  const testPayload = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'your-test-email@example.com', // Change to your email for testing
    companyName: 'Acme Startup',
    sector: 'saas',
    timestamp: new Date().toISOString(),
    membershipUrl: 'https://zscalecapital.com/membership'
  };

  sendAdvisorMatchEmail(testPayload);
  console.log('Test email sent!');
}

/**
 * Test getting sector advisors
 */
function testGetSectorAdvisors() {
  const sectors = ['saas', 'fintech', 'healthcare', 'manufacturing', 'aerospace', 'energy'];

  sectors.forEach(sector => {
    const advisors = getSectorAdvisors(sector);
    console.log(`${sector}:`, advisors.primary.title);
  });
}
