
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from '@/lib/utils';

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">DebtReminderPro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">דף הבית</Link>
            <Link to="#features" className="text-gray-700 hover:text-primary font-medium">תכונות</Link>
            <Link to="#pricing" className="text-gray-700 hover:text-primary font-medium">מחירים</Link>
            <Link to="#faq" className="text-gray-700 hover:text-primary font-medium">שאלות נפוצות</Link>
            <Link to="#contact" className="text-gray-700 hover:text-primary font-medium">צור קשר</Link>
          </nav>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Button variant="outline" asChild>
              <Link to="/login">התחברות</Link>
            </Button>
            <Button asChild>
              <Link to="/register">הרשמה</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden bg-white rounded-lg shadow-lg absolute right-4 left-4 top-16 p-4 transition-all duration-300",
          mobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        )}>
          <nav className="flex flex-col space-y-4 mb-4">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">דף הבית</Link>
            <Link to="#features" className="text-gray-700 hover:text-primary font-medium">תכונות</Link>
            <Link to="#pricing" className="text-gray-700 hover:text-primary font-medium">מחירים</Link>
            <Link to="#faq" className="text-gray-700 hover:text-primary font-medium">שאלות נפוצות</Link>
            <Link to="#contact" className="text-gray-700 hover:text-primary font-medium">צור קשר</Link>
          </nav>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">התחברות</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/register">הרשמה</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
