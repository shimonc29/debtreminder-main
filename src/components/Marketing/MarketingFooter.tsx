
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">DebtReminderPro</h3>
            <p className="text-gray-600 mb-4">המערכת המתקדמת לניהול חובות ותזכורות תשלום, המסייעת לעסקים להגדיל את שיעורי הגבייה ולחסוך זמן יקר.</p>
            <div className="flex space-x-4 space-x-reverse">
              <Link to="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary">דף הבית</Link></li>
              <li><Link to="/#features" className="text-gray-600 hover:text-primary">תכונות</Link></li>
              <li><Link to="/#pricing" className="text-gray-600 hover:text-primary">מחירים</Link></li>
              <li><Link to="/#faq" className="text-gray-600 hover:text-primary">שאלות נפוצות</Link></li>
              <li><Link to="/login" className="text-gray-600 hover:text-primary">התחברות</Link></li>
              <li><Link to="/register" className="text-gray-600 hover:text-primary">הרשמה</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">מידע משפטי</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-primary">תנאי שימוש</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary">מדיניות פרטיות</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-primary">מדיניות עוגיות</Link></li>
              <li><Link to="/gdpr" className="text-gray-600 hover:text-primary">תאימות GDPR</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">צור קשר</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 ml-2 text-gray-500" />
                <a href="mailto:info@debtreminderapp.com" className="text-gray-600 hover:text-primary">info@debtreminderapp.com</a>
              </li>
              <li className="text-gray-600">
                טלפון: 03-1234567
              </li>
              <li className="text-gray-600">
                רחוב הרצל 123, תל אביב, ישראל
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} DebtReminderPro. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
