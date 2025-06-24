# 📧 מדריך הגדרת שירות המיילים

## ✅ מה תוקן

1. **נוסף קובץ `package.json`** ב-api directory
2. **תוקן משתני סביבה** - תמיכה ב-VITE_RESEND_API_KEY וגם RESEND_API_KEY
3. **נוסף ENDPOINT_API_KEY** לאבטחה
4. **עודכנו TRUSTED_ORIGINS** לכלול את הדומיינים הנכונים

## 🔧 מה צריך לעשות כדי שהמיילים יעבדו

### שלב 1: צור קובץ `.env.local` בשורש הפרויקט

```bash
# Supabase Configuration  
VITE_SUPABASE_URL=https://hzdmmuuowjlrgtaalbum.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDcyNTMsImV4cCI6MjA2NDUyMzI1M30.7BXm54AfCR6YM1Y2zaaF-vJtQrR5pv2NjJtFRero0gM
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk0NzI1MywiZXhwIjoyMDY0NTIzMjUzfQ.5ErEtMB-rsUXi8IhkUtJIkfrl3PGhQHiEYjK8-_dIcA

# Resend Email Service (תמיכה בשני הפורמטים)
VITE_RESEND_API_KEY=re_ZcuAvx1K_FDY78JgSDzNxjj4vUoyJzJQB
RESEND_API_KEY=re_ZcuAvx1K_FDY78JgSDzNxjj4vUoyJzJQB

# API Endpoint Security (החלף במפתח חזק שלך!)
ENDPOINT_API_KEY=my_super_secure_api_key_123456
```

### שלב 2: התקן Dependencies

```bash
cd api
npm install
cd ..
```

### שלב 3: בדוק שכתובת האימייל מאושרת ב-Resend

1. היכנס ל-[Resend Dashboard](https://resend.com/dashboard)
2. לך ל-Domains או Verified Senders
3. ודא שכתובת האימייל השולחת מאושרת

### שלב 4: עדכן דומיינים ב-TRUSTED_ORIGINS

אם האתר שלך באינטרנט, עדכן את הדומיינים בקובץ `api/send-email.js`:

```javascript
const TRUSTED_ORIGINS = [
  'https://your-actual-domain.com',     // החלף בדומיין שלך
  'https://debt-reminder-nexus.web.app',
  'http://localhost:3000',
  'http://localhost:5173',
];
```

## 🧪 איך לבדוק שהמיילים עובדים

### בדיקה מקומית:
```bash
npm run dev
# גש ל: http://localhost:5173/test-integrations
```

### בדיקה ידנית עם Curl:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my_super_secure_api_key_123456" \
  -d '{
    "to": "test@example.com",
    "from": "noreply@yourdomain.com", 
    "fromName": "DebtReminder",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<p>This is a test email</p>"
  }'
```

## 🚨 שגיאות נפוצות ופתרונות

### שגיאה: "Missing Resend API key"
- ודא שה-API key של Resend תקף ומוגדר נכון

### שגיאה: "Unauthorized" 
- בדוק שה-ENDPOINT_API_KEY מוגדר נכון

### שגיאה: "CORS error"
- ודא שהדומיין שלך מוגדר ב-TRUSTED_ORIGINS

### שגיאה: "Domain not verified" 
- אשר את הדומיין או כתובת האימייל ב-Resend Dashboard

## 🔐 הערות אבטחה

- **אל תשתף מפתחות API בפומבי**
- השתמש במפתחות אבטחה חזקים ל-ENDPOINT_API_KEY  
- ודא שקובץ `.env.local` לא נשמר ב-Git

---

**הקובץ עכשיו אמור להיות תקין ולעבוד!** 🎉