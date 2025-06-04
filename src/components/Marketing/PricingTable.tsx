
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PricingTable() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Plan */}
      <div className="bg-white rounded-xl shadow-md p-8 border-2 border-gray-100">
        <h3 className="text-2xl font-bold mb-2">מסלול חינמי</h3>
        <p className="text-gray-600 mb-6">לעסקים קטנים או לניסיון ראשוני</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">₪0</span>
          <span className="text-gray-500"> / חודש</span>
        </div>
        <Button asChild className="w-full mb-8">
          <Link to="/register">התחל עכשיו - חינם</Link>
        </Button>
        <ul className="space-y-3">
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            <span>עד 5 לקוחות</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            <span>עד 20 חובות בחודש</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            <span>תזכורות במייל בלבד</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            <span>דשבורד בסיסי</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            <span>גיבוי נתונים שבועי</span>
          </li>
        </ul>
      </div>

      {/* Premium Plan */}
      <div className="bg-primary text-white rounded-xl shadow-lg p-8 border-2 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-yellow-400 text-primary px-3 py-1 font-medium transform rotate-0 translate-x-2 -translate-y-0 text-sm">
          פופולרי
        </div>
        <h3 className="text-2xl font-bold mb-2">מסלול פרימיום</h3>
        <p className="text-blue-100 mb-6">לעסקים בצמיחה הדורשים פתרון מקיף</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">₪99</span>
          <span className="text-blue-200"> / חודש</span>
        </div>
        <Button asChild className="w-full mb-8 bg-white text-primary hover:bg-blue-50">
          <Link to="/register">הצטרף עכשיו</Link>
        </Button>
        <ul className="space-y-3">
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>לקוחות ללא הגבלה</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>חובות ללא הגבלה</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>תזכורות במייל ו-WhatsApp</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>דשבורד מתקדם עם אנליטיקות</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>תבניות מותאמות אישית</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>white-labeling (דומיין מותאם אישית)</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>גיבוי נתונים יומי</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-blue-200 ml-2 flex-shrink-0" />
            <span>תמיכה בעדיפות גבוהה</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
