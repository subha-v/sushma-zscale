# Integration Test Guide

## ✅ Your Setup Status

**Google Apps Script URL**: Configured ✅
**PDF File ID**: `19GuPy5Lnj3VEi97kbQyIMeOsNzyxj6j-` ✅
**Google Sheet**: Founder Leads ✅
**Script Name**: Dallas Ecosystem Map ✅

---

## 🔍 Verification Checklist

Before testing from the website, verify your Apps Script setup:

### Step 1: Verify Apps Script Code

1. **Open your Apps Script**:
   - Go to [Google Sheets](https://docs.google.com/spreadsheets/d/16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA/edit)
   - Click "Extensions" → "Apps Script"

2. **Compare with Reference Code**:
   - Open the file `APPS_SCRIPT_CODE.js` in this project
   - Make sure your script has:
     - ✅ PDF File ID: `19GuPy5Lnj3VEi97kbQyIMeOsNzyxj6j-`
     - ✅ Sheet Name: `Founder Leads`
     - ✅ Correct column mapping (8 columns)

3. **Critical Code Sections to Verify**:

   **PDF File ID (around line 50)**:
   ```javascript
   const pdfFileId = '19GuPy5Lnj3VEi97kbQyIMeOsNzyxj6j-';
   ```

   **Sheet Name (around line 31)**:
   ```javascript
   const sheet = spreadsheet.getSheetByName('Founder Leads');
   ```

   **Column Mapping (around line 40-48)**:
   ```javascript
   const rowData = [
     timestamp,                        // Column A: Timestamp
     data.firstName || '',             // Column B: First Name
     data.lastName || '',              // Column C: Last Name
     data.email || '',                 // Column D: Email
     data.companyName || '',           // Column E: Company
     data.currentStage || '',          // Column F: Stage
     'Dallas Ecosystem Map',           // Column G: Download
     data.email || ''                  // Column H: Email (duplicate column)
   ];
   ```

---

### Step 2: Test Apps Script Directly

Before testing from the website, test the script in Google Apps Script:

1. **Update Test Email**:
   - In Apps Script, find the `testSetup()` function
   - Change line: `email: 'your-email@example.com'`
   - Replace with YOUR actual email address

2. **Run Test Function**:
   - In the function dropdown, select `testSetup`
   - Click the Run button (▶️)
   - **First time**: You'll need to authorize the script
     - Click "Review Permissions"
     - Choose your account
     - Click "Advanced" → "Go to Dallas Ecosystem Map (unsafe)"
     - Click "Allow"

3. **Check Results**:
   - View the "Execution log" (bottom of screen)
   - You should see:
     ```
     ✅ Sheet write successful
     ✅ Email send successful
     ✅ All tests passed!
     ```

4. **Verify Test Data**:
   - Check your Google Sheet - should see a new row with test data
   - Check your email inbox - should receive email with PDF attached

**If the test fails**:
- Read the error message in execution log
- Common issues:
  - Wrong PDF file ID → Update line with file ID
  - Wrong sheet name → Verify sheet tab is named "Founder Leads"
  - Permission errors → Re-authorize the script

---

### Step 3: Verify Deployment

1. **Check Deployment Status**:
   - In Apps Script, click "Deploy" → "Manage deployments"
   - You should see an active deployment
   - **Execute as**: Should say "Me (your-email)"
   - **Who has access**: Should say "Anyone"

2. **Verify URL**:
   - The Web app URL should match what's in your `.env` file
   - Current URL in `.env`:
     ```
     https://script.google.com/macros/s/AKfycbwlEUxJe1XA6mtFB0XfpE-kpR6vJrtF3UEgrrQfwSnwjxl1Wus7UlKzV15oV-t3TQ/exec
     ```

3. **If URLs Don't Match**:
   - Copy the Web app URL from "Manage deployments"
   - Update `.env` file with the correct URL
   - Restart dev server: Stop and run `npm run dev`

---

## 🧪 Test from Website

Now test the complete flow from your website:

### Test 1: Form Submission

1. **Open the Ecosystem Map Page**:
   ```
   http://localhost:5174/ecosystem-map
   ```

2. **Fill Out the Form**:
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Email**: YOUR REAL EMAIL (so you can verify the PDF arrives)
   - **Company**: Any company name or leave blank
   - **Current Stage**: Select any option
   - **Consent**: Check the box

3. **Submit the Form**:
   - Click "📥 Download Free Guide"
   - Watch for loading spinner
   - Should see success alert: "Success! Check your email for the Dallas Founder Manual."

4. **Verify Data in Google Sheet**:
   - Open [your Google Sheet](https://docs.google.com/spreadsheets/d/16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA/edit)
   - Check the "Founder Leads" tab
   - Should see a new row with:
     - Timestamp (current time)
     - Your first name
     - Your last name
     - Your email
     - Company name (or blank)
     - Stage selection
     - "Dallas Ecosystem Map"
     - Your email again (duplicate column)

5. **Check Your Email**:
   - Check your email inbox (and spam folder)
   - Subject: "Your 2026 Dallas Ecosystem Map is here!"
   - Should have PDF attachment
   - Open PDF to verify it's the correct file

---

### Test 2: Popup Functionality

**Homepage Popup (10 seconds)**:
```
1. Visit: http://localhost:5174/
2. Wait 10 seconds
3. Popup should appear
4. Click "Signup" button
5. Should open Google Form in new tab
```

**Ecosystem Map Popup (15 seconds)**:
```
1. Visit: http://localhost:5174/ecosystem-map
2. Wait 15 seconds OR scroll to form section
3. Popup should appear
4. Test close methods:
   - ESC key
   - Click outside modal
   - X button in corner
5. Refresh page - popup should NOT appear again
```

**Reset Popup** (for testing):
```
1. Open DevTools (F12)
2. Go to Application tab
3. Local Storage → http://localhost:5174
4. Right-click → Clear
5. Refresh page - popup should appear again
```

---

## 🐛 Troubleshooting

### Issue: Form Submits but No Email

**Check Apps Script Execution Log**:
1. Go to Apps Script editor
2. Click "Executions" (clock icon) in left sidebar
3. Find the recent execution
4. Click it to see the logs
5. Look for error messages

**Common Causes**:
- ❌ Wrong PDF file ID → Update in script
- ❌ PDF file not accessible → Check permissions in Google Drive
- ❌ Gmail quota exceeded → Free accounts: 100 emails/day
- ❌ Email in spam → Check spam folder

---

### Issue: Form Submits but No Data in Sheet

**Verify**:
1. Sheet name is exactly "Founder Leads" (case-sensitive)
2. Sheet ID matches in script
3. Script has permission to access sheet

**Debug**:
1. Run `testSetup()` function in Apps Script
2. Check execution logs for errors

---

### Issue: Browser Console Errors

**CORS Error** (This is Normal):
```
Access to fetch at 'https://script.google.com/...' from origin 'http://localhost:5174'
has been blocked by CORS policy
```
- ✅ This is expected with `mode: 'no-cors'`
- ✅ The form still works correctly
- ✅ You can ignore this error

**Other Errors**:
- Check Network tab in DevTools
- Look for failed requests
- Verify environment variable is loaded

---

### Issue: "Google Apps Script URL not configured" Alert

**Fix**:
1. Check `.env` file has the URL
2. Restart dev server: `npm run dev`
3. Verify no typos in variable name
4. Make sure URL starts with `https://script.google.com/macros/s/`

---

## ✅ Success Checklist

You'll know everything is working when:

- [x] Apps Script `testSetup()` runs without errors
- [x] Test email arrives with PDF attached
- [x] Test data appears in Google Sheet
- [ ] Website form submits successfully
- [ ] Form data appears in Google Sheet
- [ ] Email arrives from website form submission
- [ ] PDF is attached to email
- [ ] Email content looks correct
- [ ] Popup appears on homepage after 10 seconds
- [ ] Popup appears on ecosystem map after 15 seconds
- [ ] No console errors (except expected CORS)

---

## 📊 Monitor Submissions

### View All Executions:
1. Apps Script editor → "Executions" (left sidebar)
2. See all form submissions and their status
3. Click any execution to see detailed logs

### Check Email Quota:
- Free Gmail: 100 emails/day
- Google Workspace: 1,500 emails/day
- View usage in Apps Script execution log

### Export Sheet Data:
- Google Sheets → File → Download → CSV
- Use for analysis or CRM import

---

## 🎯 What to Test

**Required Tests**:
1. ✅ Apps Script test function
2. ✅ Form submission from website
3. ✅ Email delivery with PDF
4. ✅ Data in Google Sheet
5. ✅ Homepage popup (10 seconds)
6. ✅ Ecosystem map popup (15 seconds)

**Optional Tests**:
- Submit multiple forms in a row
- Test with different email providers (Gmail, Outlook, Yahoo)
- Test on mobile device
- Test with very long company names
- Test with special characters in names

---

## 📞 Next Steps

**If Everything Works**:
1. ✅ Mark all items in success checklist
2. 🚀 Ready for production deployment
3. 📝 Document any customizations
4. 🎉 Celebrate!

**If Something Doesn't Work**:
1. Check the specific troubleshooting section above
2. Review Apps Script execution logs
3. Verify all file IDs and sheet names
4. Re-run authorization if needed
5. Check this guide's troubleshooting section

---

## 🚀 Production Deployment

When ready to deploy:

1. **Build**:
   ```bash
   npm run build
   ```

2. **Add to Hosting**:
   - Upload `dist` folder to your hosting (Netlify, Vercel, etc.)
   - Add environment variable: `VITE_GOOGLE_SCRIPT_URL`
   - Use the same URL from your `.env` file

3. **Test on Production**:
   - Submit a test form on live site
   - Verify email arrives
   - Check Google Sheet for data

---

**Current Server**: http://localhost:5174/

**Ready to Test**: Visit the form page and submit! 🎉
