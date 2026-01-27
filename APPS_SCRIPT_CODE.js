// ============================================================================
// Google Apps Script for zScale Capital - MASTER ROUTER
// Version: 7.0 (Multi-Tab Command Center + Asset Tracking)
//
// ROUTING:
// - ecosystem_map     → Ecosystem_Map tab
// - advisor_match     → Advisor_Matches tab
// - readiness_index   → IRI_Audits tab
// - newsletter        → Newsletter_Subscribers tab
// - tool_access       → Tool_Access tab
// - valuation_tool    → Valuation_Benchmarks tab
// - equity_evaluator  → Equity_Calculations tab
// - alpha_membership  → Alpha_Members tab + Welcome Email
// - shadow_capital    → Ecosystem_Map tab + Interested_in_Shadow_Capital tag
// - library_signup    → Newsletter_Subscribers tab + Lead_Source: Venture_Library, Intent: Education
// - asset_interaction → Updates Asset_Interactions column in Master_Registry
//
// ALL LEADS → Master_Registry (no-double-entry)
//
// Deploy as: Web App (Execute as: Me, Access: Anyone)
// ============================================================================

// Configuration
const CONFIG = {
  // Master spreadsheet containing all tabs
  MASTER_SHEET_ID: '16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA',

  // Tab names
  TABS: {
    MASTER_REGISTRY: 'Master_Registry',
    ECOSYSTEM_MAP: 'Ecosystem_Map',
    ADVISOR_MATCHES: 'Advisor_Matches',
    IRI_AUDITS: 'IRI_Audits',
    NEWSLETTER: 'Newsletter_Subscribers',
    TOOL_ACCESS: 'Tool_Access',
    VALUATION_BENCHMARKS: 'Valuation_Benchmarks',
    EQUITY_CALCULATIONS: 'Equity_Calculations',
    ALPHA_MEMBERS: 'Alpha_Members'
  },

  // PDF for venture map download
  PDF_FILE_ID: '19GuPy5Lnj3VEi97kbQyIMeOsNzyxj6j-',

  // URLs
  IRI_AUDIT_URL: 'https://zscalecapital.com/startup-readiness-audit/',
  WEBSITE_URL: 'https://zscalecapital.com'
};

// ============================================================================
// MAIN ROUTER
// ============================================================================

/**
 * Main POST handler - Master Router
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Log for debugging
    Logger.log('=== NEW SUBMISSION ===');
    Logger.log('formType: ' + data.formType);
    Logger.log('source: ' + data.source);
    Logger.log('email: ' + data.email);

    const formType = String(data.formType || '').trim().toLowerCase();

    // 1. ALWAYS update Master Registry first
    updateMasterRegistry(data);
    Logger.log('Master Registry updated');

    // 2. Route to appropriate handler based on formType
    switch (formType) {
      case 'ecosystem_map':
        writeToEcosystemMap(data);
        sendVentureMapEmail(data);
        Logger.log('Ecosystem Map submission processed');
        break;

      case 'advisor_match':
        writeToAdvisorMatches(data);
        sendAdvisorMatchEmail(data);
        Logger.log('Advisor Match submission processed');
        break;

      case 'readiness_index':
        writeToIRIAudits(data);
        sendIRIScorecardEmail(data);
        Logger.log('IRI Audit submission processed');
        break;

      case 'newsletter':
        writeToNewsletter(data);
        Logger.log('Newsletter subscription processed');
        break;

      case 'tool_access':
        writeToToolAccess(data);
        Logger.log('Tool access logged');
        break;

      case 'valuation_tool':
        writeToValuationBenchmarks(data);
        Logger.log('Valuation benchmark submission processed');
        break;

      case 'equity_evaluator':
        writeToEquityCalculations(data);
        Logger.log('Equity calculation submission processed');
        break;

      case 'alpha_membership':
        writeToAlphaMembers(data);
        sendAlphaWelcomeEmail(data);
        Logger.log('Alpha membership processed');
        break;

      case 'shadow_capital':
        writeToShadowCapital(data);
        Logger.log('Shadow Capital lead processed');
        break;

      case 'library_signup':
        writeToLibrarySignup(data);
        Logger.log('Library signup processed - Education Intent');
        break;

      case 'asset_interaction':
        trackAssetInteraction(data);
        Logger.log('Asset interaction tracked: ' + (data.assetTag || 'unknown'));
        break;

      default:
        Logger.log('WARNING: Unknown formType "' + formType + '"');
    }

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      formType: formType,
      message: 'Data recorded successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================================
// MASTER REGISTRY (No-Double-Entry Logic)
// ============================================================================

/**
 * Update Master Registry with no-double-entry logic
 * - If new email: Create new row
 * - If existing email: Update LastActiveDate and Highest_IRI_Score (if applicable)
 */
function updateMasterRegistry(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.MASTER_REGISTRY);

  // Create tab if it doesn't exist
  if (!sheet) {
    sheet = createMasterRegistryTab(spreadsheet);
  }

  const email = (data.email || '').toLowerCase().trim();
  if (!email) {
    Logger.log('No email provided, skipping Master Registry');
    return;
  }

  // Search for existing email
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  // Find column indices
  const emailCol = headers.indexOf('Email');
  const lastActiveCol = headers.indexOf('LastActiveDate');
  const highestIRICol = headers.indexOf('Highest_IRI_Score');
  const formTypesCol = headers.indexOf('FormTypes_Used');

  if (emailCol === -1) {
    Logger.log('Email column not found in Master Registry');
    return;
  }

  // Search for existing email
  let existingRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === email) {
      existingRow = i + 1; // 1-indexed for sheets
      break;
    }
  }

  const now = new Date();
  const currentIRIScore = data.totalScore || 0;

  if (existingRow > 0) {
    // UPDATE existing record
    Logger.log('Updating existing record for: ' + email);

    // Update LastActiveDate
    if (lastActiveCol !== -1) {
      sheet.getRange(existingRow, lastActiveCol + 1).setValue(now);
    }

    // Update Highest_IRI_Score if current score is higher
    if (highestIRICol !== -1 && data.formType === 'readiness_index') {
      const currentHighest = Number(values[existingRow - 1][highestIRICol]) || 0;
      if (currentIRIScore > currentHighest) {
        sheet.getRange(existingRow, highestIRICol + 1).setValue(currentIRIScore);
        Logger.log('Updated highest IRI score: ' + currentIRIScore);
      }
    }

    // Append formType to FormTypes_Used
    if (formTypesCol !== -1) {
      const existingTypes = String(values[existingRow - 1][formTypesCol] || '');
      const formType = data.formType || '';
      if (!existingTypes.includes(formType)) {
        const newTypes = existingTypes ? existingTypes + ', ' + formType : formType;
        sheet.getRange(existingRow, formTypesCol + 1).setValue(newTypes);
      }
    }

  } else {
    // CREATE new record
    Logger.log('Creating new record for: ' + email);

    const newRow = [
      now,                              // FirstSeen
      now,                              // LastActiveDate
      data.firstName || '',             // First_Name
      data.lastName || '',              // Last_Name
      email,                            // Email
      data.companyName || '',           // Company_Name
      data.sector || '',                // Sector
      data.currentStage || data.stage || '',  // Stage
      currentIRIScore || '',            // Highest_IRI_Score
      data.emailTier || '',             // Email_Tier (Business/Personal)
      data.leadTag || '',               // Lead_Tags
      data.formType || '',              // FormTypes_Used
      data.source || ''                 // Source
    ];

    sheet.appendRow(newRow);
  }
}

/**
 * Create Master Registry tab with headers
 */
function createMasterRegistryTab(spreadsheet) {
  const sheet = spreadsheet.insertSheet(CONFIG.TABS.MASTER_REGISTRY);

  const headers = [
    'FirstSeen',
    'LastActiveDate',
    'First_Name',
    'Last_Name',
    'Email',
    'Company_Name',
    'Sector',
    'Stage',
    'Highest_IRI_Score',
    'Email_Tier',
    'Lead_Tags',
    'FormTypes_Used',
    'Source'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#0A0A0B');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#01F9C6');
  sheet.setFrozenRows(1);

  Logger.log('Created Master_Registry tab with headers');
  return sheet;
}

// ============================================================================
// TAB WRITERS
// ============================================================================

/**
 * Write to Ecosystem_Map tab
 */
function writeToEcosystemMap(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.ECOSYSTEM_MAP);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.ECOSYSTEM_MAP);
    const headers = [
      'Timestamp',
      'First_Name',
      'Last_Name',
      'Email',
      'Company_Name',
      'Current_Stage',
      'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.companyName || '',
    data.currentStage || '',
    data.source || 'ecosystem-map'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to Advisor_Matches tab
 */
function writeToAdvisorMatches(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.ADVISOR_MATCHES);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.ADVISOR_MATCHES);
    const headers = [
      'Timestamp',
      'First_Name',
      'Last_Name',
      'Email',
      'Company_Name',
      'Sector',
      'Stage',
      // PMF Evidence
      'PMF_Customer_Validation',
      'PMF_Revenue_Model',
      'PMF_Competitive_Advantage',
      // Financial
      'Financial_Runway',
      'Financial_Fundraising_Ready',
      'Financial_Metrics',
      // Team
      'Team_CoFounders',
      'Team_Key_Hires',
      'Team_Advisory_Gaps',
      // Advisor Network
      'Advisor_Current_Network',
      'Advisor_Needed_Expertise',
      'Advisor_Engagement_Style',
      'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.companyName || '',
    data.sector || '',
    data.currentStage || '',
    // PMF Evidence
    data.pmfCustomerValidation || '',
    data.pmfRevenueModel || '',
    data.pmfCompetitiveAdvantage || '',
    // Financial
    data.financialRunway || '',
    data.financialFundraisingReady || '',
    data.financialMetrics || '',
    // Team
    data.teamCoFounders || '',
    data.teamKeyHires || '',
    data.teamAdvisoryGaps || '',
    // Advisor Network
    data.advisorCurrentNetwork || '',
    data.advisorNeededExpertise || '',
    data.advisorEngagementStyle || '',
    data.source || 'advisor-diagnostic'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to IRI_Audits tab with specified column mappings
 */
function writeToIRIAudits(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.IRI_AUDITS);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.IRI_AUDITS);
    const headers = [
      'Timestamp',
      'First_Name',
      'Last_Name',
      'Email',
      'Company_Name',
      'Sector',
      // Scores
      'Total_Score',
      'Vector_1_PMF_Evidence',
      'Vector_2_Unit_Economics',
      'Vector_3_Team_Advisors',
      'Vector_4_Infrastructure',
      'Vector_5_Capital_Position',
      'Penalty_Applied',
      'Penalty_Amount',
      'Recommended_Workshop',
      'Workshop_Priority',
      // Raw PMF Answers
      'PMF_Customer_Validation',
      'PMF_Retention',
      'PMF_Organic_Growth',
      // Raw Unit Economics Answers
      'Metric_Unit_Economics_Knowledge',
      'Metric_CAC_LTV',
      'Metric_Revenue_Model',
      // Raw Team Answers
      'Team_Founder_Background',
      'Team_Completeness',
      'Team_Advisor_Network',
      // Raw Infrastructure Answers
      'Infra_Legal_Structure',
      'Infra_Financial_Tracking',
      'Infra_Data_Room',
      // Raw Capital Answers
      'Capital_Fundraising_Exp',
      'Capital_Investor_Relations',
      'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#0A0A0B');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#01F9C6');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.companyName || '',
    data.sector || '',
    // Scores
    data.totalScore || 0,
    data.vector1PmfEvidence || 0,
    data.vector2UnitEconomics || 0,
    data.vector3TeamAdvisors || 0,
    data.vector4Infrastructure || 0,
    data.vector5CapitalPosition || 0,
    data.penaltyApplied ? 'Yes' : 'No',
    data.penaltyAmount || 0,
    data.recommendedWorkshop || '',
    data.workshopPriority || '',
    // Raw PMF Answers
    data.pmfCustomerValidation || '',
    data.pmfRetention || '',
    data.pmfOrganicGrowth || '',
    // Raw Unit Economics Answers
    data.metricUnitEconomicsKnowledge || '',
    data.metricCacLtv || '',
    data.metricRevenueModel || '',
    // Raw Team Answers
    data.teamFounderBackground || '',
    data.teamCompleteness || '',
    data.teamAdvisorNetwork || '',
    // Raw Infrastructure Answers
    data.infraLegalStructure || '',
    data.infraFinancialTracking || '',
    data.infraDataRoom || '',
    // Raw Capital Answers
    data.capitalFundraisingExp || '',
    data.capitalInvestorRelations || '',
    data.source || 'investment-readiness-index'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to Newsletter_Subscribers tab
 */
function writeToNewsletter(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.NEWSLETTER);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.NEWSLETTER);
    const headers = [
      'Timestamp',
      'Email',
      'Source',
      'Status'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Check for duplicate
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const email = (data.email || '').toLowerCase().trim();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]).toLowerCase().trim() === email) {
      Logger.log('Newsletter subscriber already exists: ' + email);
      return; // Skip duplicate
    }
  }

  const rowData = [
    new Date(),
    email,
    data.source || 'footer-newsletter',
    'subscribed'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to Tool_Access tab
 */
function writeToToolAccess(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.TOOL_ACCESS);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.TOOL_ACCESS);
    const headers = [
      'Timestamp',
      'First_Name',
      'Last_Name',
      'Email',
      'Tool_Accessed',
      'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.toolAccessed || '',
    data.source || 'tool-access'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to Valuation_Benchmarks tab
 * Strategic Value: Identifies if founder is "delusional" about worth
 * AI Agent Potential: Can auto-draft "Reality Check" emails based on Dallas sector multiples
 */
function writeToValuationBenchmarks(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.VALUATION_BENCHMARKS);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.VALUATION_BENCHMARKS);
    const headers = [
      'Timestamp',
      'Email',  // Primary key to Master_Registry
      'First_Name',
      'Last_Name',
      'Company_Name',
      'Sector',
      'IRI_Score',
      // Valuation Inputs
      'Company_Stage',
      'Annual_Revenue',
      'Monthly_Revenue',
      'Revenue_Growth_Rate',
      'Gross_Margin',
      'Team_Size',
      'Funding_Raised',
      'Previous_Valuation',
      // Valuation Outputs
      'Calculated_Valuation_Low',
      'Calculated_Valuation_Mid',
      'Calculated_Valuation_High',
      'Valuation_Method',
      'Revenue_Multiple_Used',
      'Dallas_Sector_Multiple',
      // Benchmark Comparison
      'Is_Above_Market',
      'Market_Delta_Percent',
      'Reality_Check_Flag',
      'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#0A0A0B');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#01F9C6');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.email || '',
    data.firstName || '',
    data.lastName || '',
    data.companyName || '',
    data.sector || '',
    data.iriScore || '',
    // Valuation Inputs
    data.companyStage || '',
    data.annualRevenue || '',
    data.monthlyRevenue || '',
    data.revenueGrowthRate || '',
    data.grossMargin || '',
    data.teamSize || '',
    data.fundingRaised || '',
    data.previousValuation || '',
    // Valuation Outputs
    data.valuationLow || '',
    data.valuationMid || '',
    data.valuationHigh || '',
    data.valuationMethod || '',
    data.revenueMultiple || '',
    data.dallasSectorMultiple || '',
    // Benchmark Comparison
    data.isAboveMarket ? 'Yes' : 'No',
    data.marketDeltaPercent || '',
    data.realityCheckFlag ? 'FLAGGED' : '',
    data.source || 'valuation-tool'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to Equity_Calculations tab
 * Strategic Value: Flags dangerous "messy cap tables" that kill deals
 * AI Agent Potential: Can suggest specific legal advisors to "clean up" equity splits
 */
function writeToEquityCalculations(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.EQUITY_CALCULATIONS);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.EQUITY_CALCULATIONS);
    const headers = [
      'Timestamp',
      'Email',  // Primary key to Master_Registry
      'First_Name',
      'Last_Name',
      'Company_Name',
      'Sector',
      'IRI_Score',
      // Equity Inputs
      'Company_Stage',
      'Advisor_Role',
      'Advisor_Experience_Level',
      'Hours_Per_Month',
      'Vesting_Period_Months',
      // Equity Outputs
      'Recommended_Equity_Percent',
      'Equity_Range_Min',
      'Equity_Range_Max',
      'Vesting_Schedule',
      // Cap Table Health
      'Total_Advisor_Equity_Allocated',
      'Founder_Equity_Remaining',
      'Cap_Table_Health_Score',
      'Is_Messy_Cap_Table',
      'Cleanup_Recommendations',
      'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#0A0A0B');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#01F9C6');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.email || '',
    data.firstName || '',
    data.lastName || '',
    data.companyName || '',
    data.sector || '',
    data.iriScore || '',
    // Equity Inputs
    data.companyStage || '',
    data.advisorRole || '',
    data.advisorExperienceLevel || '',
    data.hoursPerMonth || '',
    data.vestingPeriodMonths || '',
    // Equity Outputs
    data.recommendedEquityPercent || '',
    data.equityRangeMin || '',
    data.equityRangeMax || '',
    data.vestingSchedule || '',
    // Cap Table Health
    data.totalAdvisorEquity || '',
    data.founderEquityRemaining || '',
    data.capTableHealthScore || '',
    data.isMessyCapTable ? 'FLAGGED' : '',
    data.cleanupRecommendations || '',
    data.source || 'equity-evaluator'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to Alpha_Members tab
 * Strategic Value: Tracks premium tier members for enhanced access
 */
function writeToAlphaMembers(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.ALPHA_MEMBERS);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.ALPHA_MEMBERS);
    const headers = [
      'Timestamp',
      'First_Name',
      'Last_Name',
      'Email',
      'Company_Name',
      'IRI_Score',
      'Source',
      'Status'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#0A0A0B');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#01F9C6');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.companyName || '',
    data.iriScore || '',
    data.source || 'membership-page',
    'Active'
  ];

  sheet.appendRow(rowData);
}

/**
 * Write to Ecosystem_Map tab for Shadow Capital leads
 * Strategic Value: Tracks founders interested in family office introductions
 * Tags lead as Interested_in_Shadow_Capital for follow-up sequences
 */
function writeToShadowCapital(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.ECOSYSTEM_MAP);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.ECOSYSTEM_MAP);
    const headers = [
      'Timestamp',
      'First_Name',
      'Last_Name',
      'Email',
      'Company_Name',
      'Email_Tier',
      'Lead_Tag',
      'Lead_Status',
      'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#0A0A0B');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#01F9C6');
    sheet.setFrozenRows(1);
  }

  const rowData = [
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.companyName || '',
    data.emailTier || 'Personal',
    'Interested_in_Shadow_Capital',
    data.leadStatus || 'High Intent',
    data.source || 'shadow-capital-landscape-download'
  ];

  sheet.appendRow(rowData);

  // Also update Master_Registry with the tag
  updateMasterRegistryWithTag(data.email, 'Interested_in_Shadow_Capital');
}

/**
 * Update Master Registry with a specific lead tag
 * Updates LastActiveDate and appends the tag to Lead_Tags column
 */
function updateMasterRegistryWithTag(email, tag) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.TABS.MASTER_REGISTRY);

  if (!sheet) {
    Logger.log('Master Registry not found for tag update');
    return;
  }

  const normalizedEmail = (email || '').toLowerCase().trim();
  if (!normalizedEmail) return;

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  const emailCol = headers.indexOf('Email');
  const lastActiveCol = headers.indexOf('LastActiveDate');
  const leadTagsCol = headers.indexOf('Lead_Tags');

  if (emailCol === -1) return;

  // Find the row with this email
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === normalizedEmail) {
      const rowIndex = i + 1;

      // Update LastActiveDate
      if (lastActiveCol !== -1) {
        sheet.getRange(rowIndex, lastActiveCol + 1).setValue(new Date());
      }

      // Append tag to Lead_Tags if column exists
      if (leadTagsCol !== -1) {
        const existingTags = String(values[i][leadTagsCol] || '');
        if (!existingTags.includes(tag)) {
          const newTags = existingTags ? existingTags + ', ' + tag : tag;
          sheet.getRange(rowIndex, leadTagsCol + 1).setValue(newTags);
        }
      }

      Logger.log('Updated Master Registry with tag: ' + tag + ' for ' + normalizedEmail);
      return;
    }
  }

  Logger.log('Email not found in Master Registry for tag update: ' + normalizedEmail);
}

/**
 * Write to Newsletter_Subscribers tab for Library signups
 * Strategic Value: Tracks founders interested in educational content
 * Tags lead as Lead_Source: Venture_Library and Lead_Intent: Education
 */
function writeToLibrarySignup(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.TABS.NEWSLETTER);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.TABS.NEWSLETTER);
    const headers = [
      'Timestamp',
      'Email',
      'Email_Tier',
      'Lead_Source',
      'Lead_Intent',
      'Source',
      'Status'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#0A0A0B');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#01F9C6');
    sheet.setFrozenRows(1);
  }

  const email = (data.email || '').toLowerCase().trim();

  // Check for duplicate
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]).toLowerCase().trim() === email) {
      Logger.log('Library subscriber already exists: ' + email);
      return; // Skip duplicate
    }
  }

  const rowData = [
    new Date(),
    email,
    data.emailTier || 'Personal',
    data.leadSource || 'Venture_Library',
    data.leadIntent || 'Education',
    data.source || 'library-briefing-signup',
    'subscribed'
  ];

  sheet.appendRow(rowData);

  // Update Master Registry with Education Intent tag
  updateMasterRegistryWithIntent(email, 'Education', 'Venture_Library');
}

/**
 * Update Master Registry with lead intent and source
 * Differentiates between Education Intent (library) vs Capital Intent (pitch forms)
 */
function updateMasterRegistryWithIntent(email, intent, leadSource) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.TABS.MASTER_REGISTRY);

  if (!sheet) {
    Logger.log('Master Registry not found for intent update');
    return;
  }

  const normalizedEmail = (email || '').toLowerCase().trim();
  if (!normalizedEmail) return;

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  const emailCol = headers.indexOf('Email');
  const lastActiveCol = headers.indexOf('LastActiveDate');
  const leadTagsCol = headers.indexOf('Lead_Tags');

  if (emailCol === -1) return;

  // Find the row with this email
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === normalizedEmail) {
      const rowIndex = i + 1;

      // Update LastActiveDate
      if (lastActiveCol !== -1) {
        sheet.getRange(rowIndex, lastActiveCol + 1).setValue(new Date());
      }

      // Append intent tag to Lead_Tags if column exists
      if (leadTagsCol !== -1) {
        const existingTags = String(values[i][leadTagsCol] || '');
        const intentTag = intent + '_Intent';
        const sourceTag = 'Source:' + leadSource;

        let newTags = existingTags;
        if (!existingTags.includes(intentTag)) {
          newTags = newTags ? newTags + ', ' + intentTag : intentTag;
        }
        if (!existingTags.includes(sourceTag)) {
          newTags = newTags ? newTags + ', ' + sourceTag : sourceTag;
        }

        if (newTags !== existingTags) {
          sheet.getRange(rowIndex, leadTagsCol + 1).setValue(newTags);
        }
      }

      Logger.log('Updated Master Registry with intent: ' + intent + ' for ' + normalizedEmail);
      return;
    }
  }

  // If email not found, create new entry with intent
  Logger.log('Creating new Master Registry entry with intent for: ' + normalizedEmail);
  const newRow = [
    new Date(),                        // FirstSeen
    new Date(),                        // LastActiveDate
    '',                                // First_Name
    '',                                // Last_Name
    normalizedEmail,                   // Email
    '',                                // Company_Name
    '',                                // Sector
    '',                                // Stage
    '',                                // Highest_IRI_Score
    '',                                // Email_Tier
    intent + '_Intent, Source:' + leadSource, // Lead_Tags
    'library_signup',                  // FormTypes_Used
    leadSource                         // Source
  ];
  sheet.appendRow(newRow);
}

/**
 * Track asset interactions in Master_Registry
 * Updates or creates Asset_Interactions column to track which assets users clicked/downloaded
 * Strategic Value: Shows which content drives engagement for follow-up optimization
 */
function trackAssetInteraction(data) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.TABS.MASTER_REGISTRY);

  if (!sheet) {
    Logger.log('Master Registry not found for asset interaction tracking');
    return;
  }

  const email = (data.email || '').toLowerCase().trim();
  const assetTag = data.assetTag || 'Unknown_Asset';
  const action = data.action || 'click';
  const timestamp = new Date().toISOString();

  // Get or create Asset_Interactions column
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  let assetInteractionsCol = headers.indexOf('Asset_Interactions');

  // Create column if it doesn't exist
  if (assetInteractionsCol === -1) {
    const lastCol = headers.length + 1;
    sheet.getRange(1, lastCol).setValue('Asset_Interactions');
    sheet.getRange(1, lastCol).setFontWeight('bold');
    assetInteractionsCol = lastCol - 1;
    Logger.log('Created Asset_Interactions column at position ' + lastCol);
  }

  const emailCol = headers.indexOf('Email');
  const lastActiveCol = headers.indexOf('LastActiveDate');

  if (emailCol === -1) {
    Logger.log('Email column not found in Master Registry');
    return;
  }

  // For anonymous users, just log and return
  if (!email || email === 'anonymous') {
    Logger.log('Anonymous asset interaction: ' + assetTag + ' (' + action + ')');
    return;
  }

  // Find the row with this email
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === email) {
      const rowIndex = i + 1;

      // Update LastActiveDate
      if (lastActiveCol !== -1) {
        sheet.getRange(rowIndex, lastActiveCol + 1).setValue(new Date());
      }

      // Append to Asset_Interactions
      const existingInteractions = String(values[i][assetInteractionsCol] || '');
      const newInteraction = assetTag + ':' + action + '@' + timestamp.split('T')[0];

      // Limit to last 10 interactions to avoid cell overflow
      let interactions = existingInteractions ? existingInteractions.split(' | ') : [];
      interactions.push(newInteraction);
      if (interactions.length > 10) {
        interactions = interactions.slice(-10);
      }

      sheet.getRange(rowIndex, assetInteractionsCol + 1).setValue(interactions.join(' | '));
      Logger.log('Tracked asset interaction for ' + email + ': ' + assetTag + ' (' + action + ')');
      return;
    }
  }

  // If email not found, log the interaction without updating (user hasn't registered yet)
  Logger.log('Asset interaction for unregistered user: ' + email + ' - ' + assetTag + ' (' + action + ')');
}

// ============================================================================
// EMAIL HANDLERS
// ============================================================================

/**
 * Send Venture Map email with PDF attachment
 */
function sendVentureMapEmail(data) {
  const pdfFile = DriveApp.getFileById(CONFIG.PDF_FILE_ID);
  const firstName = data.firstName || 'Founder';

  const subject = "Your 2026 Dallas Founder Manual is here!";

  const body = `Hi ${firstName},

Thanks for downloading the 2026 Dallas Founder Manual! You'll find everything you need to navigate the North Texas startup ecosystem inside.

Your personalized PDF is attached.

KEY SECTIONS TO REVIEW:
- Page 6: The "Unwritten Rules" of Dallas fundraising
- Page 12: Shadow Capital List (35+ Family Offices)
- Page 24: Institutional Package Checklist

NEXT STEP: Complete your Investment Readiness Assessment to get matched with Dallas advisors who fit your sector and stage.

-> Take the assessment: ${CONFIG.IRI_AUDIT_URL}

Looking forward to supporting your journey,
The zScale Capital Team

---
Dallas Venture Operating System
${CONFIG.WEBSITE_URL}`;

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    attachments: [pdfFile.getAs(MimeType.PDF)],
    name: 'zScale Capital'
  });
}

/**
 * Send Advisor Match confirmation email
 */
function sendAdvisorMatchEmail(data) {
  const firstName = data.firstName || 'Founder';
  const companyName = data.companyName || 'your startup';
  const sector = data.sector || 'Technology';

  const sectorDisplay = sector.charAt(0).toUpperCase() + sector.slice(1).replace('-', ' ');

  const subject = `[Confirmed] Advisor Diagnostic Results for ${companyName}`;

  const body = `Hi ${firstName},

Your diagnostic for ${companyName} is complete. You can view your identified ${sectorDisplay} sector matches on your dashboard.

WHAT WE FOUND:
Based on your responses, we've identified preliminary matches within our Shadow Network of Dallas-based industrial veterans who specialize in ${sectorDisplay}.

NEXT STEP:
To unlock warm introductions to these advisors, a zScale Alpha Membership is required to verify your data room readiness.

-> Learn more: ${CONFIG.IRI_AUDIT_URL}

The zScale Capital Team
Dallas Venture Operating System

---
${CONFIG.WEBSITE_URL}`;

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    name: 'zScale Capital'
  });
}

/**
 * Send IRI Scorecard email with results
 */
function sendIRIScorecardEmail(data) {
  const firstName = data.firstName || 'Founder';
  const companyName = data.companyName || 'Your Startup';
  const totalScore = data.totalScore || 0;
  const workshop = data.recommendedWorkshop || 'Investment Readiness Workshop';
  const penaltyApplied = data.penaltyApplied;

  // Determine score tier
  let scoreTier, scoreMessage;
  if (totalScore > 70) {
    scoreTier = 'INVESTOR READY';
    scoreMessage = 'Strong position for institutional capital';
  } else if (totalScore > 40) {
    scoreTier = 'GROWTH PHASE';
    scoreMessage = 'Key areas need strengthening';
  } else {
    scoreTier = 'FOUNDATION BUILDING';
    scoreMessage = 'Critical gaps to address before fundraising';
  }

  const subject = `[IRI Scorecard] ${companyName}: ${totalScore}/100 - ${scoreTier}`;

  let body = `Hi ${firstName},

Your Investment Readiness Index (IRI) assessment is complete.

=====================================
YOUR SCORE: ${totalScore}/100
STATUS: ${scoreTier}
=====================================

${scoreMessage}

SCORE BREAKDOWN:
- PMF Evidence (25%): ${data.vector1PmfEvidence || 0}/25
- Unit Economics (30%): ${data.vector2UnitEconomics || 0}/30
- Team & Advisors (20%): ${data.vector3TeamAdvisors || 0}/20
- Infrastructure (15%): ${data.vector4Infrastructure || 0}/15
- Capital Positioning (10%): ${data.vector5CapitalPosition || 0}/10`;

  if (penaltyApplied) {
    body += `

[!] NOTE: A -20 point penalty was applied because Dallas VCs expect founders to know their unit economics cold.`;
  }

  body += `

=====================================
RECOMMENDED: ${workshop}
=====================================

This workshop is capped at 10 founders to maintain "Institutional Intimacy."

Based on your score, we recommend attending our "${workshop}" to address your specific gaps and accelerate your path to funding.

"The Unwritten Rules of DFW Fundraising" - Learn what Dallas VCs don't tell you.

-> Sign up: ${CONFIG.IRI_AUDIT_URL}

The zScale Capital Team
Dallas Venture Operating System

---
${CONFIG.WEBSITE_URL}`;

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    name: 'zScale Capital'
  });
}

/**
 * Send Alpha Membership Welcome Email
 * Triggered when a user joins the Alpha Tier
 */
function sendAlphaWelcomeEmail(data) {
  const firstName = data.firstName || 'Founder';
  const email = data.email;

  if (!email) {
    Logger.log('No email provided for Alpha welcome email');
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
                  Institutional Grade
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
                  The Portal
                </h3>
                <p style="font-size: 14px; color: #9CA3AF; margin: 0; line-height: 1.5;">
                  You can now see the "Unfiltered" view of your Valuation and Equity benchmarks. Access dilution forecasts, cap table red flags, and sector-specific multiples.
                </p>
              </div>

              <!-- The Network -->
              <div style="background-color: #0A0A0B; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 3px solid #01F9C6;">
                <h3 style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0;">
                  The Network
                </h3>
                <p style="font-size: 14px; color: #9CA3AF; margin: 0; line-height: 1.5;">
                  Your Advisor matches are unlocked. You may now request direct warm introductions to our Sector Specialists and Shadow Capital Partners.
                </p>
              </div>

              <!-- The Standard -->
              <div style="background-color: #0A0A0B; border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 3px solid #01F9C6;">
                <h3 style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0;">
                  The Standard
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
                <a href="${CONFIG.WEBSITE_URL}" style="display: inline-block; padding: 16px 32px; background-color: #01F9C6; color: #0A0A0B; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
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

  const plainTextBody = `Welcome to the Inner Circle: zScale Alpha Activated

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

    Logger.log('Alpha welcome email sent successfully to: ' + email);
    return true;
  } catch (error) {
    Logger.log('Error sending Alpha welcome email: ' + error.toString());
    return false;
  }
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

/**
 * Test Ecosystem Map submission
 */
function testEcosystemMap() {
  const testData = {
    formType: 'ecosystem_map',
    firstName: 'Test',
    lastName: 'Founder',
    email: 'test@example.com', // CHANGE THIS
    companyName: 'Test Startup',
    currentStage: 'mvp',
    source: 'ecosystem-map-2026'
  };

  Logger.log('=== Testing ECOSYSTEM MAP ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToEcosystemMap(testData);
    Logger.log('Ecosystem_Map tab updated');

    // Uncomment to test email:
    // sendVentureMapEmail(testData);
    // Logger.log('Email sent');

    Logger.log('ECOSYSTEM MAP test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test Advisor Match submission
 */
function testAdvisorMatch() {
  const testData = {
    formType: 'advisor_match',
    firstName: 'Test',
    lastName: 'Advisor',
    email: 'test@example.com', // CHANGE THIS
    companyName: 'Test Startup',
    sector: 'fintech',
    currentStage: 'revenue',
    source: 'advisor-diagnostic',
    // Diagnostic answers
    pmfCustomerValidation: 'paying_customers',
    pmfRevenueModel: 'recurring',
    pmfCompetitiveAdvantage: 'technology',
    financialRunway: '12_months',
    financialFundraisingReady: 'preparing',
    financialMetrics: 'tracking',
    teamCoFounders: 'solo',
    teamKeyHires: 'core_team',
    teamAdvisoryGaps: 'fundraising',
    advisorCurrentNetwork: 'informal',
    advisorNeededExpertise: 'go_to_market',
    advisorEngagementStyle: 'monthly'
  };

  Logger.log('=== Testing ADVISOR MATCH ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToAdvisorMatches(testData);
    Logger.log('Advisor_Matches tab updated');

    Logger.log('ADVISOR MATCH test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test IRI Audit submission
 */
function testIRIAudit() {
  const testData = {
    formType: 'readiness_index',
    firstName: 'Test',
    lastName: 'IRI',
    email: 'test@example.com', // CHANGE THIS
    companyName: 'Test Startup Inc',
    sector: 'saas',
    source: 'investment-readiness-index',
    // Scores
    totalScore: 65,
    vector1PmfEvidence: 20,
    vector2UnitEconomics: 18,
    vector3TeamAdvisors: 15,
    vector4Infrastructure: 8,
    vector5CapitalPosition: 4,
    penaltyApplied: false,
    penaltyAmount: 0,
    recommendedWorkshop: 'Investment Readiness Workshop',
    workshopPriority: 'high',
    // Raw answers
    pmfCustomerValidation: 'paying_customers',
    pmfRetention: 'strong_retention',
    pmfOrganicGrowth: 'word_of_mouth',
    metricUnitEconomicsKnowledge: 'deep_understanding',
    metricCacLtv: 'healthy',
    metricRevenueModel: 'recurring',
    teamFounderBackground: 'experienced',
    teamCompleteness: 'mostly_complete',
    teamAdvisorNetwork: 'developing',
    infraLegalStructure: 'delaware_c',
    infraFinancialTracking: 'organized',
    infraDataRoom: 'mostly_ready',
    capitalFundraisingExp: 'angel_round',
    capitalInvestorRelations: 'some_connections'
  };

  Logger.log('=== Testing IRI AUDIT ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToIRIAudits(testData);
    Logger.log('IRI_Audits tab updated');

    Logger.log('IRI AUDIT test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test IRI with penalty
 */
function testIRIWithPenalty() {
  const testData = {
    formType: 'readiness_index',
    firstName: 'Test',
    lastName: 'Penalty',
    email: 'penalty@example.com', // CHANGE THIS
    companyName: 'Penalty Test Inc',
    sector: 'fintech',
    source: 'investment-readiness-index',
    // Scores with penalty
    totalScore: 45,
    vector1PmfEvidence: 20,
    vector2UnitEconomics: 5,
    vector3TeamAdvisors: 15,
    vector4Infrastructure: 10,
    vector5CapitalPosition: 5,
    penaltyApplied: true,
    penaltyAmount: -20,
    recommendedWorkshop: 'Foundation Workshop',
    workshopPriority: 'urgent',
    // Raw answers
    pmfCustomerValidation: 'paying_customers',
    pmfRetention: 'moderate_retention',
    pmfOrganicGrowth: 'mixed_channels',
    metricUnitEconomicsKnowledge: 'dont_know', // Triggers penalty
    metricCacLtv: 'unknown',
    metricRevenueModel: 'recurring',
    teamFounderBackground: 'experienced',
    teamCompleteness: 'building',
    teamAdvisorNetwork: 'informal',
    infraLegalStructure: 'other_corp',
    infraFinancialTracking: 'basic',
    infraDataRoom: 'in_progress',
    capitalFundraisingExp: 'bootstrapped',
    capitalInvestorRelations: 'cold_outreach'
  };

  Logger.log('=== Testing IRI with PENALTY ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToIRIAudits(testData);
    Logger.log('IRI_Audits tab updated (with penalty)');

    Logger.log('IRI PENALTY test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test Newsletter subscription
 */
function testNewsletter() {
  const testData = {
    formType: 'newsletter',
    email: 'newsletter@example.com', // CHANGE THIS
    source: 'footer-newsletter'
  };

  Logger.log('=== Testing NEWSLETTER ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToNewsletter(testData);
    Logger.log('Newsletter_Subscribers tab updated');

    Logger.log('NEWSLETTER test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test Tool Access logging
 */
function testToolAccess() {
  const testData = {
    formType: 'tool_access',
    firstName: 'Test',
    lastName: 'User',
    email: 'tool@example.com', // CHANGE THIS
    toolAccessed: 'Equity Calculator',
    source: 'Tool: Equity Calculator'
  };

  Logger.log('=== Testing TOOL ACCESS ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToToolAccess(testData);
    Logger.log('Tool_Access tab updated');

    Logger.log('TOOL ACCESS test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test Valuation Tool submission
 */
function testValuationTool() {
  const testData = {
    formType: 'valuation_tool',
    firstName: 'Test',
    lastName: 'Valuation',
    email: 'valuation@example.com', // CHANGE THIS
    companyName: 'Valuation Test Inc',
    sector: 'saas',
    iriScore: 72,
    // Valuation Inputs
    companyStage: 'seed',
    annualRevenue: 500000,
    monthlyRevenue: 45000,
    revenueGrowthRate: 15,
    grossMargin: 75,
    teamSize: 8,
    fundingRaised: 250000,
    previousValuation: 2000000,
    // Valuation Outputs
    valuationLow: 3500000,
    valuationMid: 5000000,
    valuationHigh: 7500000,
    valuationMethod: 'revenue_multiple',
    revenueMultiple: 10,
    dallasSectorMultiple: 8,
    // Benchmark Comparison
    isAboveMarket: true,
    marketDeltaPercent: 25,
    realityCheckFlag: false,
    source: 'valuation-tool'
  };

  Logger.log('=== Testing VALUATION TOOL ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToValuationBenchmarks(testData);
    Logger.log('Valuation_Benchmarks tab updated');

    Logger.log('VALUATION TOOL test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test Equity Evaluator submission
 */
function testEquityEvaluator() {
  const testData = {
    formType: 'equity_evaluator',
    firstName: 'Test',
    lastName: 'Equity',
    email: 'equity@example.com', // CHANGE THIS
    companyName: 'Equity Test Inc',
    sector: 'fintech',
    iriScore: 65,
    // Equity Inputs
    companyStage: 'mvp',
    advisorRole: 'strategic',
    advisorExperienceLevel: 'expert',
    hoursPerMonth: 5,
    vestingPeriodMonths: 24,
    // Equity Outputs
    recommendedEquityPercent: 0.5,
    equityRangeMin: 0.25,
    equityRangeMax: 0.75,
    vestingSchedule: 'Monthly over 24 months',
    // Cap Table Health
    totalAdvisorEquity: 3.5,
    founderEquityRemaining: 78,
    capTableHealthScore: 85,
    isMessyCapTable: false,
    cleanupRecommendations: '',
    source: 'equity-evaluator'
  };

  Logger.log('=== Testing EQUITY EVALUATOR ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToEquityCalculations(testData);
    Logger.log('Equity_Calculations tab updated');

    Logger.log('EQUITY EVALUATOR test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test messy cap table flagging
 */
function testMessyCapTable() {
  const testData = {
    formType: 'equity_evaluator',
    firstName: 'Test',
    lastName: 'Messy',
    email: 'messy@example.com', // CHANGE THIS
    companyName: 'Messy Cap Inc',
    sector: 'healthcare',
    iriScore: 45,
    // Equity Inputs
    companyStage: 'idea',
    advisorRole: 'board',
    advisorExperienceLevel: 'thought_leader',
    hoursPerMonth: 2,
    vestingPeriodMonths: 12,
    // Equity Outputs
    recommendedEquityPercent: 1.5,
    equityRangeMin: 1.0,
    equityRangeMax: 2.0,
    vestingSchedule: 'Monthly over 12 months',
    // Cap Table Health - MESSY
    totalAdvisorEquity: 18,
    founderEquityRemaining: 45,
    capTableHealthScore: 35,
    isMessyCapTable: true,
    cleanupRecommendations: 'Consider consolidating advisor agreements. High total advisor allocation may concern VCs.',
    source: 'equity-evaluator'
  };

  Logger.log('=== Testing MESSY CAP TABLE ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToEquityCalculations(testData);
    Logger.log('Equity_Calculations tab updated with FLAGGED status');

    Logger.log('MESSY CAP TABLE test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test Master Registry no-double-entry (run twice with same email)
 */
function testNoDoubleEntry() {
  const testData = {
    formType: 'ecosystem_map',
    firstName: 'Double',
    lastName: 'Entry',
    email: 'double@example.com', // CHANGE THIS
    companyName: 'Double Test Inc',
    currentStage: 'growth',
    source: 'test-double-entry'
  };

  Logger.log('=== Testing NO-DOUBLE-ENTRY ===');
  Logger.log('Running first submission...');

  try {
    updateMasterRegistry(testData);
    Logger.log('First submission complete');

    // Change source and run again
    testData.source = 'test-double-entry-SECOND';
    testData.formType = 'advisor_match';

    Logger.log('Running second submission with same email...');
    updateMasterRegistry(testData);
    Logger.log('Second submission complete');

    Logger.log('NO-DOUBLE-ENTRY test PASSED - check sheet for single row with updated data');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Test Shadow Capital submission
 */
function testShadowCapital() {
  const testData = {
    formType: 'shadow_capital',
    firstName: 'Test',
    lastName: 'Shadow',
    email: 'shadow@example.com', // CHANGE THIS
    companyName: 'Shadow Test Inc',
    emailTier: 'Business',
    leadStatus: 'High Intent',
    leadTag: 'Interested_in_Shadow_Capital',
    source: 'shadow-capital-landscape-download'
  };

  Logger.log('=== Testing SHADOW CAPITAL ===');

  try {
    updateMasterRegistry(testData);
    Logger.log('Master Registry updated');

    writeToShadowCapital(testData);
    Logger.log('Shadow Capital lead logged to Ecosystem_Map');

    Logger.log('SHADOW CAPITAL test PASSED');
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
  }
}

/**
 * Verify all tabs exist
 */
function verifySetup() {
  Logger.log('=== VERIFYING SETUP ===');

  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.MASTER_SHEET_ID);
    Logger.log('Spreadsheet opened: ' + spreadsheet.getName());

    const tabs = Object.values(CONFIG.TABS);

    tabs.forEach(tabName => {
      const sheet = spreadsheet.getSheetByName(tabName);
      if (sheet) {
        Logger.log('Tab exists: ' + tabName);
      } else {
        Logger.log('Tab MISSING: ' + tabName + ' (will be created on first submission)');
      }
    });

    Logger.log('Setup verification complete');
  } catch (error) {
    Logger.log('Setup verification failed: ' + error.toString());
  }
}
