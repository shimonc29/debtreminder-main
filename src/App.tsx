import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InstallPWA } from '@/components/ui/InstallPWA';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';

// Lazy-loaded Pages
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Customers = lazy(() => import("./pages/Customers"));
const CustomerDetails = lazy(() => import("./pages/CustomerDetails"));
const Debts = lazy(() => import("./pages/Debts"));
const DebtDetails = lazy(() => import("./pages/DebtDetails"));
const Templates = lazy(() => import("./pages/Templates"));
const Reminders = lazy(() => import("./pages/Reminders"));
const ReminderSettings = lazy(() => import("./pages/ReminderSettings"));
const ReminderResponse = lazy(() => import("./pages/ReminderResponse"));
const CustomerResponses = lazy(() => import("./pages/CustomerResponses"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const IntegrationTest = lazy(() => import("./pages/IntegrationTest"));
const EmailTest = lazy(() => import("./pages/EmailTest"));
// Admin Pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminSubscriptions = lazy(() => import("./pages/Admin/AdminSubscriptions"));
const AdminLogs = lazy(() => import("./pages/Admin/AdminLogs"));
const AdminNotifications = lazy(() => import("./pages/Admin/AdminNotifications"));
const AdminWhatsApp = lazy(() => import("./pages/Admin/AdminWhatsApp"));
const AdminEmail = lazy(() => import("./pages/Admin/AdminEmail"));
const AdminPaymentGateways = lazy(() => import("./pages/Admin/AdminPaymentGateways"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center text-lg">טוען...</div>
);

const App = () => (
  <ErrorBoundary>
    {/* Skip to main content link for accessibility */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-primary text-white px-4 py-2 rounded shadow"
      tabIndex={0}
    >
      דלג לתוכן הראשי
    </a>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<Loader />}>
              <main id="main-content" tabIndex={-1} className="outline-none">
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
                  <Route path="/test-integrations" element={<IntegrationTest />} />
                  <Route path="/email-test" element={<EmailTest />} />
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
              </main>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      <OfflineIndicator />
      <InstallPWA />
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
