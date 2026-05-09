# Email Notification Setup Guide

## Overview
You now have a complete contact form system with email notifications!

### How It Works:
1. Users fill out the contact form on your website
2. Form data is saved to MongoDB database
3. You receive an email notification immediately
4. The user receives a confirmation email
5. You can view all contacts in the admin dashboard

---

## Setup Instructions

### Step 1: Get Gmail App Password (If Using Gmail)

1. Go to your Google Account: https://myaccount.google.com/
2. Select "Security" from the left menu
3. Enable 2-Step Verification (if not already enabled)
4. Search for "App passwords"
5. Select "Mail" and "Windows Computer"
6. Google will generate a 16-character password
7. Copy this password

### Step 2: Update .env File

In `backend/.env`, add these lines:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=your-email@gmail.com
```

**Replace:**
- `your-email@gmail.com` → Your Gmail address
- `xxxx xxxx xxxx xxxx` → The 16-character app password from step 1

### Step 3: Restart Backend Server

```bash
cd backend
npm start
```

---

## Testing

1. Go to your website's contact section
2. Fill out the contact form with test data
3. Submit the form
4. Check your email inbox for:
   - **Admin notification** (detailed form submission)
   - **User confirmation** (thank you email)

---

## Admin Dashboard Features

View all submissions from the admin dashboard:
- Go to `/admin`
- Login with your credentials
- Check the "Bookings" tab (contacts are saved here too)

---

## Troubleshooting

### "Email service not configured"
- Make sure `.env` file has `EMAIL_USER` and `EMAIL_PASSWORD`
- Verify Gmail app password is correct
- Restart the backend server

### Emails not sending
- Check spam/promotions folder
- Verify 2-Step Verification is enabled on your Google account
- Try creating a new app password

### Form submission fails
- Check browser console for errors
- Verify backend API is running on `http://localhost:5000`
- Check MongoDB connection

---

## Email Customization

To customize email templates, edit:
- `backend/controllers/contactController.js`

Look for the `transporter.sendMail()` sections to change:
- Email subject
- Email styling
- Email content

---

## Production Deployment

For production:
1. Use a professional email service like SendGrid or AWS SES
2. Update email configuration in `config/email.js`
3. Never commit `.env` file to GitHub
4. Use environment variables provided by your hosting platform

---

## API Endpoints

### POST /api/contact (Public)
Submit a new contact form

**Request:**
```json
{
  "name": "Ankit Singh",
  "email": "ankit@example.com",
  "phone": "+91 98765 43210",
  "subject": "Wedding Photography",
  "message": "I would like to inquire..."
}
```

### GET /api/contact (Protected - Admin Only)
Get all contact submissions

### GET /api/contact/:id (Protected - Admin Only)
Get specific contact and mark as read

### DELETE /api/contact/:id (Protected - Admin Only)
Delete a contact submission

---

## Support

If you face any issues, check:
1. Backend server logs
2. Browser console
3. Gmail security settings
4. MongoDB connection

Good luck! 🎉
