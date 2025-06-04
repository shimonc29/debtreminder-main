
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTotalDebtAmount, getOverdueDebtAmount, debts, customers, reminders } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Users, Check, Clock, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';

export function DashboardOverview() {
  const totalDebtAmount = getTotalDebtAmount();
  const overdueDebtAmount = getOverdueDebtAmount();
  const totalCustomers = customers.length;
  const paidDebts = debts.filter(debt => debt.status === 'paid').length;
  const totalDebts = debts.length;
  const paidPercentage = totalDebts > 0 ? Math.round((paidDebts / totalDebts) * 100) : 0;

  // Calculate customer responses count
  const customerResponsesCount = debts.filter(debt => debt.status === 'payment_claimed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard 
        title="סך החובות"
        value={formatCurrency(totalDebtAmount)}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        trend={{ value: 12, label: "מהחודש הקודם", positive: true }}
      />
      <StatCard 
        title="חובות באיחור"
        value={formatCurrency(overdueDebtAmount)}
        icon={<Clock className="h-5 w-5 text-destructive" />}
        trend={{ value: 5, label: "מהשבוע שעבר", positive: false }}
      />
      <StatCard 
        title="מספר לקוחות"
        value={totalCustomers.toString()}
        icon={<Users className="h-5 w-5 text-primary" />}
        trend={{ value: 3, label: "השבוע", positive: true }}
      />
      <StatCard 
        title="אחוז תשלומים"
        value={`${paidPercentage}%`}
        icon={<Check className="h-5 w-5 text-green-500" />}
        trend={{ value: 8, label: "מהחודש הקודם", positive: true }}
      />
      <StatCard 
        title="תגובות לקוחות"
        value={customerResponsesCount}
        icon={<MessageSquare className="h-5 w-5" />}
        trend={{ value: 100, label: "תגובות לתזכורות שטרם טופלו", positive: true }}
      />
    </div>
  );
}
