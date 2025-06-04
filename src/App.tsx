
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Debts from "./pages/Debts";
import DebtDetails from "./pages/DebtDetails";
import Templates from "./pages/Templates";
import Reminders from "./pages/Reminders";
import ReminderSettings from "./pages/ReminderSettings";
import ReminderResponse from "./pages/ReminderResponse";
import CustomerResponses from "./pages/CustomerResponses";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminSubscriptions from "./pages/Admin/AdminSubscriptions";
import AdminLogs from "./pages/Admin/AdminLogs";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import AdminWhatsApp from "./pages/Admin/AdminWhatsApp";
import AdminEmail from "./pages/Admin/AdminEmail";
import AdminPaymentGateways from "./pages/Admin/AdminPaymentGateways";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/debts/:id" element={<DebtDetails />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/reminders/settings" element={<ReminderSettings />} />
            <Route path="/reminder/response/:token" element={<ReminderResponse />} />
            <Route path="/customer-responses" element={<CustomerResponses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
            <Route path="/admin/email" element={<AdminEmail />} />
            <Route path="/admin/payment-gateways" element={<AdminPaymentGateways />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
