# 🚀 מדריך הגדרת משתני סביבה - DebtReminder

## 📋 סקירה כללית

פרויקט זה משתמש במשתני סביבה כדי להתחבר ל-Supabase (מסד נתונים) ו-Resend (שירות אימיילים). המדריך הזה יסביר לך איך להגדיר את כל המשתנים הנדרשים.

## 🔧 משתני הסביבה הנדרשים

### Supabase Configuration
```env
VITE_SUPABASE_URL=https://hzdmmuuowjlrgtaalbum.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDcyNTMsImV4cCI6MjA2NDUyMzI1M30.7BXm54AfCR6YM1Y2zaaF-vJtQrR5pv2NjJtFRero0gM
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk0NzI1MywiZXhwIjoyMDY0NTIzMjUzfQ.5ErEtMB-rsUXi8IhkUtJIkfrl3PGhQHiEYjK8-_dIcA
```

### Resend Email Service
```env
VITE_RESEND_API_KEY=re_ZcuAvx1K_FDY78JgSDzNxjj4vUoyJzJQB
```

## 🛠️ הגדרה לפיתוח מקומי

### שלב 1: יצירת קובץ .env.local
צור קובץ בשם `.env.local` בשורש הפרויקט והוסף את המשתנים הבאים:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://hzdmmuuowjlrgtaalbum.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDcyNTMsImV4cCI6MjA2NDUyMzI1M30.7BXm54AfCR6YM1Y2zaaF-vJtQrR5pv2NjJtFRero0gM
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk0NzI1MywiZXhwIjoyMDY0NTIzMjUzfQ.5ErEtMB-rsUXi8IhkUtJIkfrl3PGhQHiEYjK8-_dIcA

# Resend Email Service
VITE_RESEND_API_KEY=re_ZcuAvx1K_FDY78JgSDzNxjj4vUoyJzJQB
```

### שלב 2: הפעלת הפרויקט
```bash
npm install
npm run dev
```

### שלב 3: בדיקת האינטגרציות
גש לכתובת: `http://localhost:5173/test-integrations`

## 🌐 הגדרה לייצור (Firebase Hosting)

### שלב 1: הגדרת משתני סביבה ב-Firebase Console

1. **גש ל-Firebase Console**: https://console.firebase.google.com/
2. **בחר את הפרויקט שלך**
3. **לך ל-Hosting → Settings**
4. **בחר את האתר שלך**
5. **לך לטאב "Environment variables"**
6. **הוסף את המשתנים הבאים**:

| שם המשתנה | ערך |
|-----------|------|
| `VITE_SUPABASE_URL` | `https://hzdmmuuowjlrgtaalbum.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDcyNTMsImV4cCI6MjA2NDUyMzI1M30.7BXm54AfCR6YM1Y2zaaF-vJtQrR5pv2NjJtFRero0gM` |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk0NzI1MywiZXhwIjoyMDY0NTIzMjUzfQ.5ErEtMB-rsUXi8IhkUtJIkfrl3PGhQHiEYjK8-_dIcA` |
| `VITE_RESEND_API_KEY` | `re_ZcuAvx1K_FDY78JgSDzNxjj4vUoyJzJQB` |

### שלב 2: הגדרת GitHub Secrets (אופציונלי)

אם אתה רוצה שהמשתנים יוגדרו אוטומטית דרך GitHub Actions:

1. **גש ל-GitHub Repository שלך**
2. **לך ל-Settings → Secrets and variables → Actions**
3. **הוסף את המשתנים הבאים**:

| שם הסוד | ערך |
|---------|------|
| `FIREBASE_SUPABASE_URL` | `https://hzdmmuuowjlrgtaalbum.supabase.co` |
| `FIREBASE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDcyNTMsImV4cCI6MjA2NDUyMzI1M30.7BXm54AfCR6YM1Y2zaaF-vJtQrR5pv2NjJtFRero0gM` |
| `FIREBASE_SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZG1tdXVvd2pscmd0YWFsYnVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk0NzI1MywiZXhwIjoyMDY0NTIzMjUzfQ.5ErEtMB-rsUXi8IhkUtJIkfrl3PGhQHiEYjK8-_dIcA` |
| `FIREBASE_RESEND_API_KEY` | `re_ZcuAvx1K_FDY78JgSDzNxjj4vUoyJzJQB` |

### שלב 3: פריסה מחדש

לאחר הגדרת המשתנים, הפרויקט יפרס מחדש אוטומטית דרך GitHub Actions.

## 🧪 בדיקת האינטגרציות

### בדיקה מקומית
```bash
npm run dev
# גש ל: http://localhost:5173/test-integrations
```

### בדיקה בייצור
גש ל: `https://your-firebase-app.web.app/test-integrations`

## 📁 מבנה הקבצים

```
src/
├── config/
│   └── env.ts              # קונפיגורציית משתני הסביבה
├── lib/
│   ├── supabase.ts         # חיבור ל-Supabase
│   └── resendService.ts    # שירות שליחת אימיילים
└── pages/
    └── IntegrationTest.tsx # דף בדיקת האינטגרציות
```

## 🔍 פתרון בעיות

### בעיה: "Missing Supabase environment variables"
**פתרון**: ודא שקובץ `.env.local` קיים בשורש הפרויקט עם כל המשתנים הנדרשים.

### בעיה: "Missing Resend API key"
**פתרון**: ודא שמפתח ה-API של Resend מוגדר נכון.

### בעיה: חיבור ל-Supabase נכשל
**פתרון**: 
1. בדוק שה-URL וה-API Key נכונים
2. ודא שהפרויקט ב-Supabase פעיל
3. בדוק הרשאות RLS (Row Level Security)

### בעיה: שליחת אימיילים נכשלת
**פתרון**:
1. בדוק שמפתח ה-API של Resend תקף
2. ודא שכתובת האימייל השולחת מאושרת ב-Resend
3. בדוק את הלוגים ב-Resend Dashboard

## 📞 תמיכה

אם אתה נתקל בבעיות:
1. בדוק את דף האינטגרציות: `/test-integrations`
2. בדוק את הלוגים ב-Console של הדפדפן
3. בדוק את הלוגים ב-Firebase Console
4. פנה לתמיכה עם פרטי השגיאה

## 🔐 אבטחה

⚠️ **חשוב**: 
- אל תשתף את מפתחות ה-API בפומבי
- השתמש במשתני סביבה בלבד
- אל תכלול את קובץ `.env.local` ב-Git
- ודא שהמפתחות מוגדרים נכון בייצור

---

**תאריך עדכון**: ינואר 2025  
**גרסה**: 1.0
