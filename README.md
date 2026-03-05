# DCoP PWA

Progressive Web App for the Digital Community of Practice surgical case management program.

## What it does
- 🏠 **Home** — live case feed from Google Sheets, one-tap registration to n8n webhook
- 🗓️ **Calendar** — shared view of all upcoming surgical sessions
- 🔔 **Alerts** — push notifications via Firebase (new cases, confirmations, reminders)
- 👤 **Profile** — personal progress dashboard (sessions registered/attended, group, eligibility)

## Deploy to Vercel (10 min)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial"
gh repo create dcop-pwa --public --push
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Framework: **Create React App**
3. Add environment variables:
   - `REACT_APP_N8N_WEBHOOK` → your n8n registration webhook URL
4. Click Deploy

### 3. Share Google Sheets publicly (for read access without backend)
In each Google Sheet: **Share → Anyone with the link → Viewer**

OR if you want to keep sheets private, deploy the included proxy:
- See `/api` folder instructions (requires Vercel serverless functions with service account JSON)

### 4. Set up Firebase Auth
1. Firebase Console → Authentication → Sign-in method → Enable **Email/Password**
2. Add users manually: Authentication → Users → Add user
   - Add each resident's email + temporary password
   - They can reset password via the app's login screen

### 5. Enable Firebase Cloud Messaging in Vercel
Add to Vercel env vars (optional, for push notifications):
- These are already baked into the service worker

### 6. Update your n8n workflow
Your registration webhook should accept:
```json
{
  "case_id": "CASE-001",
  "resident_name": "Sara Al-Amine",
  "resident_email": "sara@hospital.com",
  "institution": "AUB Medical Center",
  "level_of_training": "PGY-3"
}
```

## Local development
```bash
npm install
cp .env.example .env.local
# fill in your n8n webhook
npm start
```

## Sending push notifications from n8n
After registration confirmation, add an HTTP node in n8n:
- POST to Firebase FCM: `https://fcm.googleapis.com/v1/projects/dcop-3f43c/messages:send`
- Use OAuth2 with your service account
- Body:
```json
{
  "message": {
    "topic": "all-residents",
    "notification": {
      "title": "New Case Posted",
      "body": "Cardiac Bypass — Mar 9 at 14:00"
    }
  }
}
```

## Column name mapping
The app maps these Google Sheets columns automatically. Make sure your sheets have headers matching one of these names:

**Sessions Master:**
- Case ID / case_id / CaseID
- Case Title / Title / title
- Surgery Date / Date / surgery_date
- Surgery Time / Time / surgery_time
- Lead Surgeon / Surgeon
- Institution / institution
- Session Type / session_type / Case type
- Status / status
- Max Capacity / max_capacity
- Current Registrations / current_registrations

**Residents Master:**
- Name / Full Name
- Email / email
- Institution / institution
- Level of Training / level_of_training / Level
- Sessions Registered / sessions_registered
- Sessions Attended / sessions_attended
- Group / group_assignment
- Status / status
