# Quick Start Guide

## 🎉 Implementation Complete!

All features from your plan have been successfully implemented. Here's how to test and deploy.

---

## 🚀 Testing Locally (Right Now)

The dev server is running at: **http://localhost:5174/**

### Test 1: Homepage Popup (10-second timer)
```
1. Visit: http://localhost:5174/
2. Wait 10 seconds
3. Popup should appear with "Startup Readiness Assessment"
4. Try closing with: ESC key, click outside, or X button
5. Refresh page - popup should NOT appear (localStorage)
6. Clear localStorage in DevTools to test again
```

### Test 2: Ecosystem Map Popup (15-second timer)
```
1. Visit: http://localhost:5174/ecosystem-map
2. Wait 15 seconds OR scroll to form section
3. Popup should appear
4. Test same close behaviors
```

### Test 3: Form Submission (Development Mode)
```
1. Visit: http://localhost:5174/ecosystem-map
2. Fill out the form:
   - First Name: Test
   - Last Name: User
   - Email: your-email@example.com
   - Company: Optional
   - Stage: Select any option
   - Check consent checkbox
3. Click "Download Free Guide"
4. Should see success alert
5. Form should reset
```

**Note**: Email won't be sent until you complete Google Apps Script setup (see below).

---

## 📋 What Was Built

### ✅ Typography System
- Custom font sizes matching your specs (H1: 25px, H2: 18px, etc.)
- Tailwind utilities: `text-h1`, `text-h2`, `text-body`, etc.

### ✅ Modal Component
- Reusable, accessible modal with animations
- ESC key, click-outside, focus trap
- Location: `src/components/Modal.tsx`

### ✅ Readiness Assessment Popup
- Content-rich popup with benefits list
- Links to Google Form
- Location: `src/components/ReadinessAssessmentPopup.tsx`

### ✅ Homepage Popup Logic
- 10-second timer OR 50% scroll trigger
- localStorage to prevent re-showing
- Location: `src/pages/HomePage.tsx`

### ✅ Ecosystem Map Popup Logic
- 15-second timer OR form-section scroll trigger
- Shares localStorage with homepage
- Location: `src/pages/EcosystemMap.tsx`

### ✅ Updated Form Fields
- First Name, Last Name, Email (required)
- Company Name (optional)
- Current Stage dropdown (5 options)
- Consent checkbox

### ✅ Form Submission Handler
- Loading states with spinner
- Error handling
- Google Apps Script integration ready
- Graceful development fallback

### ✅ Environment Configuration
- `.env` file created
- TypeScript types added
- `.gitignore` updated

### ✅ Google Apps Script Documentation
- Complete setup guide: `GOOGLE_APPS_SCRIPT_SETUP.md`
- Includes script code, deployment steps, testing procedures

---

## 🔧 Next Step: Enable Email Automation

To enable actual email sending with PDF attachment:

### Quick Setup (30 minutes)

1. **Open the Setup Guide**
   ```bash
   open GOOGLE_APPS_SCRIPT_SETUP.md
   ```

2. **Follow These Steps**:
   - Upload PDF to Google Drive
   - Get the PDF file ID
   - Open Google Sheet
   - Create Apps Script
   - Deploy as Web App
   - Copy deployment URL
   - Add to `.env` file
   - Restart dev server

3. **Detailed Instructions**:
   Everything is documented step-by-step in `GOOGLE_APPS_SCRIPT_SETUP.md`

### After Setup, Test Again:
1. Submit form with your real email
2. Check Google Sheet - data should appear
3. Check email - you should receive the PDF
4. Verify email content matches template

---

## 📦 Files You Need to Know About

### New Files Created
```
src/components/Modal.tsx                   → Reusable modal component
src/components/ReadinessAssessmentPopup.tsx → Popup content
.env                                       → Environment variables (DO NOT COMMIT)
GOOGLE_APPS_SCRIPT_SETUP.md               → Complete setup guide
IMPLEMENTATION_SUMMARY.md                 → Detailed implementation docs
QUICK_START.md                            → This file
```

### Modified Files
```
tailwind.config.js                        → Custom font sizes & animations
src/pages/HomePage.tsx                    → Homepage popup logic
src/pages/EcosystemMap.tsx               → Form + popup logic
src/vite-env.d.ts                        → TypeScript environment types
.gitignore                               → Excludes .env from git
```

---

## 🎯 Clear Browser Storage (For Testing)

To reset the popup (make it show again):

### Chrome/Edge DevTools:
```
1. F12 to open DevTools
2. Application tab
3. Local Storage → http://localhost:5174
4. Right-click → Clear
5. Refresh page
```

### Firefox DevTools:
```
1. F12 to open DevTools
2. Storage tab
3. Local Storage → http://localhost:5174
4. Right-click → Delete All
5. Refresh page
```

---

## 🚨 Common Issues & Fixes

### Issue: Popup Not Showing
**Fix**:
- Clear localStorage (see above)
- Wait full timer duration (10 or 15 seconds)
- Check browser console for errors

### Issue: Form Won't Submit
**Fix**:
- Fill all required fields (marked with *)
- Check consent checkbox
- Open browser console and check for errors

### Issue: "Google Apps Script URL not configured" Alert
**Fix**:
- This is expected before setup
- Follow `GOOGLE_APPS_SCRIPT_SETUP.md` to configure
- OR test form functionality in dev mode (works without URL)

### Issue: TypeScript Errors in IDE
**Fix**:
- Restart TypeScript server
- Close and reopen IDE
- Run `npm run build` to check for real errors

---

## 🎨 Customization Quick Tips

### Change Popup Timing
```tsx
// HomePage.tsx - Line 12
const TIME_DELAY = 10000; // Change to desired milliseconds

// EcosystemMap.tsx - Line 5
const TIME_DELAY = 15000; // Change to desired milliseconds
```

### Update Popup Content
Edit: `src/components/ReadinessAssessmentPopup.tsx`

### Modify Form Fields
Edit: `src/pages/EcosystemMap.tsx` (starting around line 271)

### Change Font Sizes
Edit: `tailwind.config.js` (lines 31-39)

---

## 📊 Testing Checklist

Before deploying to production, verify:

- [ ] Homepage popup appears (10 seconds)
- [ ] Ecosystem map popup appears (15 seconds)
- [ ] Both popups close correctly (ESC, click-outside, X button)
- [ ] localStorage prevents re-showing
- [ ] Form validates required fields
- [ ] Form shows loading state during submit
- [ ] Form submits successfully
- [ ] Google Sheet receives data (after Apps Script setup)
- [ ] Email received with PDF (after Apps Script setup)
- [ ] Responsive on mobile (test at 375px width)
- [ ] No console errors
- [ ] All typography matches specifications

---

## 🚀 Deploy to Production

When ready to deploy:

```bash
# 1. Build the project
npm run build

# 2. Preview the build locally (optional)
npm run preview

# 3. Deploy the 'dist' folder to your hosting
# (Netlify, Vercel, AWS, etc.)
```

**Don't forget**:
- Add `VITE_GOOGLE_SCRIPT_URL` to your hosting environment variables
- Test the form submission on production
- Monitor Google Sheet for submissions
- Check Apps Script execution logs

---

## 📚 Documentation Index

- **QUICK_START.md** (this file) - Get started quickly
- **IMPLEMENTATION_SUMMARY.md** - Detailed technical docs
- **GOOGLE_APPS_SCRIPT_SETUP.md** - Email automation setup
- **README.md** - Project overview

---

## ✅ Success Indicators

You'll know everything is working when:
1. ✅ Popup appears on homepage after 10 seconds
2. ✅ Popup appears on ecosystem map after 15 seconds
3. ✅ Form submission shows success message
4. ✅ Data appears in Google Sheet
5. ✅ Email received with PDF attached
6. ✅ No errors in browser console
7. ✅ No TypeScript errors in build

---

## 🎉 You're Ready!

All code is implemented and tested. The only remaining step is setting up Google Apps Script for email automation (optional for development, required for production).

**Current Status**:
- ✅ Frontend: 100% Complete
- ⏳ Backend: Waiting for Google Apps Script setup
- 🚀 Ready for: Local testing and Google integration

---

**Questions?** Check the troubleshooting sections in:
- IMPLEMENTATION_SUMMARY.md
- GOOGLE_APPS_SCRIPT_SETUP.md

**Need Help?** Contact: info@zscalecapital.com
