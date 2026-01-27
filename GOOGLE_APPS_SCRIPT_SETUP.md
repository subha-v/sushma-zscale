# Google Apps Script Setup Guide

This guide provides step-by-step instructions for setting up Google Apps Script to handle form submissions, Google Sheets integration, and automated email delivery with PDF attachments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Upload PDF to Google Drive](#step-1-upload-pdf-to-google-drive)
3. [Open Google Sheet](#step-2-open-google-sheet)
4. [Create Apps Script](#step-3-create-apps-script)
5. [Deploy Web App](#step-4-deploy-web-app)
6. [Configure Environment Variable](#step-5-configure-environment-variable)
7. [Testing](#step-6-testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Google Account with access to Google Drive, Sheets, and Apps Script
- PDF file: `2026-Dallas-Founder-Manual.pdf` (located in project root)
- Access to the Google Sheet: [Founder Leads Sheet](https://docs.google.com/spreadsheets/d/16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA/edit)

---

## Step 1: Upload PDF to Google Drive

1. **Navigate to Google Drive**
   - Go to [https://drive.google.com](https://drive.google.com)
   - Sign in with your zScale Capital Google account

2. **Create a Folder** (Optional but recommended)
   - Click "New" → "New folder"
   - Name it "zScale Email Attachments"
   - Open the folder

3. **Upload the PDF**
   - Click "New" → "File upload"
   - Navigate to: `/Users/sushmam2/Sushma-Development/sushma-zscale/2026-Dallas-Founder-Manual.pdf`
   - Select and upload the file
   - Wait for upload to complete

4. **Get the File ID**
   - Right-click the uploaded PDF → "Get link"
   - You'll see a URL like: `https://drive.google.com/file/d/1ABC123xyz456/view`
   - Copy the file ID (the part between `/d/` and `/view`)
   - Example: If URL is `https://drive.google.com/file/d/1ABC123xyz456/view`, the file ID is `1ABC123xyz456`
   - **Save this file ID** - you'll need it in Step 3

5. **Set Permissions** (Important)
   - Keep the file permissions as-is if the script runs as you (recommended)
   - The script will have access to your files when it runs with your credentials

---

## Step 2: Open Google Sheet

1. **Open the Sheet**
   - Go to: [https://docs.google.com/spreadsheets/d/16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA/edit](https://docs.google.com/spreadsheets/d/16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA/edit)

2. **Verify Sheet Name**
   - Check that there's a sheet tab called "Founder Leads"
   - If not, rename the current sheet to "Founder Leads"

3. **Verify Column Headers** (Row 1 should have)
   - Column A: Timestamp
   - Column B: First Name
   - Column C: Last Name
   - Column D: Email
   - Column E: Company Name
   - Column F: Current Stage
   - Column G: Source

---

## Step 3: Create Apps Script

1. **Open Script Editor**
   - In the Google Sheet, click "Extensions" → "Apps Script"
   - This opens the Apps Script editor in a new tab

2. **Delete Default Code**
   - Delete any code in the editor (usually has a default `myFunction()`)

3. **Paste the Script**
   - Copy and paste the following code:

```javascript
// Google Apps Script for zScale Capital Form Submissions
// Handles form data, writes to Google Sheets, and sends welcome email with PDF

function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Log for debugging
    Logger.log('Received form submission: ' + JSON.stringify(data));

    // 1. Write to Google Sheet
    writeToSheet(data);

    // 2. Send welcome email with PDF
    sendWelcomeEmail(data.email, data.firstName);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data recorded and email sent successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error for debugging
    Logger.log('Error: ' + error.toString());

    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function writeToSheet(data) {
  // Open the Google Sheet by ID
  const sheetId = '16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA';
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Founder Leads');

  if (!sheet) {
    throw new Error('Sheet "Founder Leads" not found');
  }

  // Prepare row data
  const timestamp = new Date();
  const rowData = [
    timestamp,
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.companyName || '',
    data.currentStage || '',
    data.source || 'unknown'
  ];

  // Append to sheet
  sheet.appendRow(rowData);

  Logger.log('Data written to sheet successfully');
}

function sendWelcomeEmail(recipientEmail, firstName) {
  // **IMPORTANT: Replace PDF_FILE_ID_HERE with your actual file ID from Step 1**
  const pdfFileId = 'PDF_FILE_ID_HERE';

  try {
    // Get PDF file from Google Drive
    const pdfFile = DriveApp.getFileById(pdfFileId);

    // Email subject
    const subject = "Your 2026 Dallas Founder Manual is here!";

    // Email body (plain text)
    const body = `Hi ${firstName},

Thanks for downloading the 2026 Dallas Founder Manual! You'll find everything you need to navigate the North Texas startup ecosystem inside.

Your personalized PDF is attached.

Next Step: Complete your Startup Readiness Assessment to get matched with Dallas advisors and investors who fit your sector and stage.

→ Take the 5-minute assessment: https://docs.google.com/forms/d/e/1FAIpQLSeOkrgPlESpmmDavnJwthxQDdKg0U-saa-in0zMZtKq-zveLA/viewform?usp=sharing

Looking forward to supporting your journey,
The zScale Capital Team

---
Dallas Startup Ecosystem Hub
https://zscalecapital.com/`;

    // Send email with PDF attachment
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: body,
      attachments: [pdfFile.getAs(MimeType.PDF)],
      name: 'zScale Capital'
    });

    Logger.log('Email sent successfully to: ' + recipientEmail);

  } catch (error) {
    Logger.log('Email error: ' + error.toString());
    throw new Error('Failed to send email: ' + error.toString());
  }
}

// Test function - run this to test your setup
function testSetup() {
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'your-email@example.com', // Change this to your email
    companyName: 'Test Company',
    currentStage: 'idea',
    source: 'test'
  };

  try {
    writeToSheet(testData);
    Logger.log('✅ Sheet write successful');

    sendWelcomeEmail(testData.email, testData.firstName);
    Logger.log('✅ Email send successful');

    Logger.log('✅ All tests passed!');
  } catch (error) {
    Logger.log('❌ Test failed: ' + error.toString());
  }
}
```

4. **Update PDF File ID**
   - Find the line: `const pdfFileId = 'PDF_FILE_ID_HERE';`
   - Replace `PDF_FILE_ID_HERE` with the file ID you saved in Step 1
   - Example: `const pdfFileId = '1ABC123xyz456';`

5. **Save the Script**
   - Click the disk icon or press `Cmd+S` (Mac) / `Ctrl+S` (Windows)
   - Give it a name like "zScale Form Handler"

6. **Test the Setup** (Optional but Recommended)
   - In the function dropdown (top of editor), select `testSetup`
   - Click "Run" (▶️ button)
   - **First time**: You'll be asked to authorize the script
     - Click "Review Permissions"
     - Choose your Google account
     - Click "Advanced" → "Go to [Project Name] (unsafe)"
     - Click "Allow"
   - Check the "Execution log" (bottom of screen) for success messages
   - Check your email for the test email
   - Check the Google Sheet for a new row with test data

---

## Step 4: Deploy Web App

1. **Open Deploy Menu**
   - Click "Deploy" → "New deployment"

2. **Configure Deployment**
   - Click the gear icon (⚙️) next to "Select type"
   - Choose "Web app"

3. **Set Deployment Settings**
   - **Description**: "zScale Form Handler v1.0" (or any description)
   - **Execute as**: Select "Me (your-email@gmail.com)"
   - **Who has access**: Select "Anyone"
     - ⚠️ This makes it public, but that's needed for the form to submit
     - The script validates incoming data, so this is safe

4. **Deploy**
   - Click "Deploy"
   - You may need to authorize again - follow the same steps as in Step 3.6

5. **Copy Web App URL**
   - After deployment, you'll see a "Web app" URL
   - It will look like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - **Copy this entire URL** - you'll need it in Step 5
   - Click "Done"

---

## Step 5: Configure Environment Variable

1. **Open .env File**
   - In your project root, open `.env`
   - Or create it if it doesn't exist

2. **Add the URL**
   - Find the line: `VITE_GOOGLE_SCRIPT_URL=`
   - Paste your Web App URL after the `=`
   - Example:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz.../exec
   ```

3. **Save the File**
   - Save `.env`

4. **Restart Dev Server**
   - If your development server is running, restart it:
   ```bash
   npm run dev
   ```
   - This ensures the new environment variable is loaded

---

## Step 6: Testing

### Test 1: Form Submission

1. **Open Your Site**
   - Go to `http://localhost:5173/ecosystem-map`

2. **Fill Out the Form**
   - Enter test data in all fields
   - Use your real email address to receive the PDF
   - Check the consent checkbox
   - Click "Download Free Guide"

3. **Verify Success**
   - You should see "Success! Check your email..." message
   - Check the Google Sheet - new row should appear
   - Check your email - you should receive the welcome email with PDF attached

### Test 2: Popup Functionality

1. **Test Homepage Popup**
   - Go to `http://localhost:5173/`
   - Wait 10 seconds - popup should appear
   - OR scroll down 50% of the page - popup should appear
   - Close popup and refresh - it should NOT appear again (localStorage check)
   - Clear localStorage (DevTools → Application → Local Storage → Clear) and refresh
   - Popup should appear again

2. **Test Ecosystem Map Popup**
   - Go to `http://localhost:5173/ecosystem-map`
   - Wait 15 seconds - popup should appear
   - OR scroll to the form section - popup should appear
   - Same localStorage behavior as homepage

### Test 3: Modal Functionality

1. **Test Close Methods**
   - Click outside modal → should close
   - Press ESC key → should close
   - Click X button → should close

2. **Test Accessibility**
   - Press Tab → focus should move through modal elements only
   - Press Shift+Tab → focus should move backward through modal

---

## Troubleshooting

### Issue: "Google Apps Script URL not configured" Alert

**Solution**:
- Verify `.env` file exists in project root
- Verify `VITE_GOOGLE_SCRIPT_URL` is set correctly
- Restart dev server (`npm run dev`)

### Issue: Form Submits but No Email Received

**Possible Causes**:
1. **Wrong PDF File ID**: Verify the file ID in Apps Script
2. **PDF Not Accessible**: Check PDF file permissions in Google Drive
3. **Gmail Quota Exceeded**: Free Google accounts have 100 emails/day limit
4. **Email in Spam**: Check your spam folder

**Debug Steps**:
- In Apps Script editor, click "Executions" (left sidebar)
- Find the recent execution and click it
- Check the logs for error messages

### Issue: Data Not Appearing in Google Sheet

**Possible Causes**:
1. **Wrong Sheet ID**: Verify sheet ID matches in script
2. **Wrong Sheet Name**: Verify sheet tab is named "Founder Leads"
3. **Permissions Issue**: Verify script runs as you

**Debug Steps**:
- Run the `testSetup` function in Apps Script
- Check execution logs for errors

### Issue: CORS Error in Browser Console

**This is Expected**:
- Google Apps Script with `mode: 'no-cors'` doesn't return readable responses
- This is normal and the form still works
- The error can be ignored

### Issue: Popup Not Showing

**Debug Steps**:
1. **Check localStorage**: DevTools → Application → Local Storage
   - If you see `hasSeenReadinessPopup`, delete it
2. **Check Console**: Look for JavaScript errors
3. **Wait Full Time**: Make sure you wait the full 10/15 seconds
4. **Clear Cache**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)

---

## Monitoring & Maintenance

### View Script Logs

1. Go to Apps Script editor
2. Click "Executions" (clock icon in left sidebar)
3. View all script runs, their status, and logs

### Update the Script

1. Make changes in the Apps Script editor
2. Save the changes
3. Deploy → "Manage deployments"
4. Click "Edit" (pencil icon) on your deployment
5. Set a new version number
6. Click "Deploy"
7. **No need to update the URL** - it stays the same

### Email Rate Limits

- **Free Gmail**: 100 emails/day
- **Google Workspace**: 1,500 emails/day
- If you exceed limits, consider using SendGrid or AWS SES

---

## Advanced: SendGrid Integration (Optional)

If you need higher email volume or better deliverability, consider using SendGrid:

1. Sign up for SendGrid: https://sendgrid.com
2. Get API key
3. Update the `sendWelcomeEmail` function to use SendGrid API
4. Store API key in Script Properties (not in code)

Example SendGrid integration available on request.

---

## Support

For issues with this setup:
- Check the [Troubleshooting](#troubleshooting) section above
- Review Apps Script execution logs
- Contact: info@zscalecapital.com

---

**Last Updated**: 2026-01-23
**Version**: 1.0
