# Form Debugging Guide

## ✅ What I Fixed

### 1. Created Success Modal
- Built the exact modal you showed me in the screenshot
- Green checkmark icon
- "Success! Check Your Email" heading
- "What's Next?" section with 3 steps
- "Find Your Advisor Match" button
- Location: `src/components/SuccessModal.tsx`

### 2. Added Enhanced Logging
The form now logs detailed information to help debug issues:
- 📤 Form data being submitted
- 🔗 Whether Google Apps Script URL is configured
- 🚀 When request is sent
- ✅ Success confirmation
- ❌ Detailed error messages

### 3. Better Error Handling
- More informative console logs
- Proper handling of no-cors mode
- Form doesn't reset until success modal is closed

---

## 🧪 Test Again

### Step 1: Open Browser Console
**Chrome/Edge**: Press `F12` or `Cmd+Option+J` (Mac) / `Ctrl+Shift+J` (Windows)
**Firefox**: Press `F12` or `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)

Keep the console open during testing - it will show helpful debug messages.

### Step 2: Open the Form
Visit: http://localhost:5174/ecosystem-map

### Step 3: Fill Out Form
Use these test values:
- **First Name**: Test
- **Last Name**: User
- **Email**: YOUR real email
- **Company**: Test Company (optional)
- **Stage**: Any option
- **Consent**: ✅ Check the box

### Step 4: Submit and Watch Console

Click "Download Free Guide" and watch the browser console. You should see:

**If Everything Works:**
```
📤 Submitting form data: {firstName: "Test", lastName: "User", ...}
🔗 Google Apps Script URL: Configured ✅
🚀 Sending request to Google Apps Script...
✅ Request sent successfully! (no-cors mode - cannot verify response)
```

**Success Modal should appear** with the exact design you showed me!

**If There's an Error:**
```
📤 Submitting form data: {firstName: "Test", lastName: "User", ...}
🔗 Google Apps Script URL: Configured ✅
🚀 Sending request to Google Apps Script...
❌ Form submission error: [error details]
```

---

## 🔍 What to Look For in Console

### Scenario 1: URL Not Configured
```
🔗 Google Apps Script URL: Not configured ❌
⚠️ Google Apps Script URL not configured
✅ Development mode: Showing success modal without sending email
```
**This means**: `.env` file doesn't have the URL or server needs restart

**Fix**:
1. Check `.env` file has `VITE_GOOGLE_SCRIPT_URL=...`
2. Restart dev server: Stop and run `npm run dev`

---

### Scenario 2: Network Error
```
❌ Form submission error: TypeError: Failed to fetch
Error details: {message: "Failed to fetch", type: "TypeError"}
```
**This means**: Request couldn't reach Google Apps Script

**Possible Causes**:
- Wrong URL in `.env`
- Apps Script not deployed
- Network/firewall blocking request
- Apps Script deployment not set to "Anyone" access

**Fix**:
1. Verify URL in `.env` matches Apps Script deployment
2. Check Apps Script is deployed as Web App
3. Verify "Who has access" is set to "Anyone"

---

### Scenario 3: CORS Error (But Works)
```
Access to fetch at 'https://script.google.com...' has been blocked by CORS policy
✅ Request sent successfully!
```
**This is NORMAL!** With `no-cors` mode, you'll see CORS warnings but the request still works.

**What to do**: Check Google Sheet and email to confirm data arrived

---

## 📊 After Submission - Verify These

### Check 1: Success Modal
- [ ] Green checkmark icon appears
- [ ] Title: "Success! Check Your Email"
- [ ] Message about PDF being sent
- [ ] "What's Next?" section with 3 items
- [ ] "Find Your Advisor Match" button
- [ ] Can close modal with ESC, click outside, or X button

### Check 2: Google Sheet
1. Open: https://docs.google.com/spreadsheets/d/16Btyljp3gdGj2Vn_zbfuW5w1khZ4AGTW5YeULO0mMBA/edit
2. Go to "Founder Leads" tab
3. Look for new row with your data

### Check 3: Email
1. Check inbox (and spam folder)
2. Subject: "Your 2026 Dallas Ecosystem Map is here!"
3. PDF should be attached
4. Verify PDF opens correctly

### Check 4: Apps Script Execution
1. Go to Apps Script: https://script.google.com
2. Open "Dallas Ecosystem Map" project
3. Click "Executions" (⏱️ clock icon)
4. Should see recent execution with "Completed" status
5. Click it to view logs

---

## 🐛 Common Issues & Solutions

### Issue: Success Modal Shows But No Email

**This means**: Frontend works, but Apps Script has an issue

**Debug**:
1. Check Apps Script execution logs
2. Look for error message in logs
3. Common causes:
   - Wrong PDF file ID
   - PDF file not accessible
   - Email quota exceeded
   - Sheet name mismatch

**Fix**: See `APPS_SCRIPT_CODE.js` for reference code

---

### Issue: Error Alert Shows

**This means**: Request failed to send

**Debug Steps**:
1. Check console for specific error
2. Verify `.env` has correct URL
3. Check Apps Script deployment settings
4. Try re-deploying Apps Script

**Quick Test**: Run `testSetup()` function in Apps Script to verify script works

---

### Issue: Form Resets Before I Can See Success Modal

**This is fixed!** Form now only resets when you close the success modal.

---

## 🎯 Expected Flow

**Correct Sequence**:
1. User fills form and clicks submit
2. Button shows "Sending..." with spinner
3. Console logs request details
4. Success modal appears
5. User closes modal
6. Form resets
7. Email arrives within 2 minutes
8. Data appears in Google Sheet

---

## 📝 Console Log Reference

Here's what each log means:

| Log | Meaning |
|-----|---------|
| `📤 Submitting form data` | Form submitted, data collected |
| `🔗 Configured ✅` | Environment variable found |
| `🔗 Not configured ❌` | No environment variable |
| `🚀 Sending request...` | Fetch request initiated |
| `✅ Request sent successfully` | No error thrown (doesn't guarantee delivery) |
| `❌ Form submission error` | Request failed to send |

---

## 🧪 Quick Debug Checklist

Before reporting an issue, verify:

- [ ] Browser console is open
- [ ] `.env` file exists in project root
- [ ] `VITE_GOOGLE_SCRIPT_URL` is set in `.env`
- [ ] Dev server was restarted after adding URL
- [ ] Apps Script is deployed as Web App
- [ ] Apps Script "Who has access" is "Anyone"
- [ ] All form fields are filled correctly
- [ ] Consent checkbox is checked

---

## 🚀 Ready to Test

Everything is set up with enhanced debugging. Try submitting the form again and:

1. **Watch the browser console** for log messages
2. **Note any error messages** (share them if needed)
3. **Check if success modal appears**
4. **Verify data in Google Sheet**
5. **Check email inbox**

The console logs will tell us exactly what's happening! 🔍
