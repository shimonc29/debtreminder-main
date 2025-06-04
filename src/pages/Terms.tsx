
import { MarketingHeader } from '@/components/Marketing/MarketingHeader';
import { MarketingFooter } from '@/components/Marketing/MarketingFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">תנאי שימוש</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              ברוכים הבאים למערכת DebtReminderPro. בהמשך השימוש במערכת זו, אתה מסכים לתנאי השימוש המפורטים להלן.
              אם אינך מסכים לתנאים אלה, אנא הימנע משימוש באתר ובשירותים שלנו.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. הגדרות</h2>
            <p className="mb-4">
              "המערכת" או "השירות" מתייחס לאפליקציית DebtReminderPro.
              "משתמש" מתייחס לכל אדם או ישות שניגש למערכת או משתמש בה.
              "תוכן" מתייחס לכל מידע, נתונים, טקסט, תמונות או חומרים אחרים המופיעים במערכת או מועלים אליה.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. תנאי שימוש כלליים</h2>
            <p className="mb-4">
              השימוש במערכת הוא באחריותך הבלעדית. המערכת מסופקת "כפי שהיא" ו"כפי שזמינה" ללא כל אחריות מכל סוג שהוא.
              אנו שומרים לעצמנו את הזכות לשנות, להשהות או להפסיק את המערכת או חלק ממנה בכל עת וללא הודעה מוקדמת.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. הרשמה וחשבונות</h2>
            <p className="mb-4">
              על מנת להשתמש בחלק מהשירותים שלנו, עליך ליצור חשבון. אתה אחראי לשמירה על סודיות הסיסמה שלך ולכל הפעילויות שמתרחשות תחת חשבונך.
              אתה מסכים לספק מידע מדויק ועדכני בעת ההרשמה ולעדכן אותו כנדרש.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. פרטיות וסודיות</h2>
            <p className="mb-4">
              השימוש שלך במערכת כפוף למדיניות הפרטיות שלנו, אשר מהווה חלק בלתי נפרד מתנאים אלה.
              אתה מסכים שאנו נאסוף ונשתמש במידע שלך בהתאם למדיניות הפרטיות שלנו.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. תשלומים ומנויים</h2>
            <p className="mb-4">
              חלק מהשירותים שלנו עשויים להיות בתשלום. אתה מסכים לשלם את כל העמלות והמיסים החלים עליך.
              התשלומים אינם ניתנים להחזר אלא אם צוין אחרת במפורש.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. הגבלת אחריות</h2>
            <p className="mb-4">
              בשום מקרה לא נהיה אחראים לנזקים ישירים, עקיפים, מקריים, מיוחדים או תוצאתיים הנובעים מהשימוש או אי היכולת להשתמש בשירות.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. שינויים בתנאים</h2>
            <p className="mb-4">
              אנו שומרים לעצמנו את הזכות לשנות תנאים אלה בכל עת. שינויים כאלה יהיו בתוקף מיד לאחר פרסומם במערכת.
              המשך השימוש שלך במערכת לאחר פרסום שינויים כאלה מהווה את הסכמתך לתנאים המעודכנים.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. יצירת קשר</h2>
            <p className="mb-6">
              אם יש לך שאלות או חששות לגבי תנאי השימוש שלנו, אנא צור קשר בכתובת info@debtreminderapp.com.
            </p>
          </div>
          
          <div className="mt-12">
            <Button asChild>
              <Link to="/">חזרה לדף הבית</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <MarketingFooter />
    </div>
  );
};

export default Terms;
