
import { debts } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export function DebtVisualizations() {
  // Calculate data for pie chart
  const pieChartData = [
    { name: 'ממתינים', value: 0, status: 'pending', color: '#FCD34D' },
    { name: 'באיחור', value: 0, status: 'overdue', color: '#EF4444' },
    { name: 'שולמו חלקית', value: 0, status: 'partially_paid', color: '#60A5FA' },
  ];

  // Process data
  debts.forEach(debt => {
    if (debt.status === 'paid') return;
    
    const remainingAmount = debt.amount - debt.paidAmount;
    const dataItem = pieChartData.find(item => item.status === debt.status);
    
    if (dataItem) {
      dataItem.value += remainingAmount;
    }
  });

  // Filter out zero values
  const filteredPieChartData = pieChartData.filter(item => item.value > 0);

  // Prepare line chart data (debts over time)
  // Group by month
  const debtsByMonth = new Map();

  debts.forEach(debt => {
    const monthKey = debt.invoiceDate.toISOString().slice(0, 7); // YYYY-MM format
    const monthName = new Intl.DateTimeFormat('he', { month: 'short' }).format(debt.invoiceDate);
    
    if (!debtsByMonth.has(monthKey)) {
      debtsByMonth.set(monthKey, { 
        month: monthName, 
        total: 0, 
        pending: 0, 
        overdue: 0,
        partially_paid: 0
      });
    }
    
    const monthData = debtsByMonth.get(monthKey);
    const remainingAmount = debt.amount - debt.paidAmount;
    
    if (debt.status !== 'paid') {
      monthData.total += remainingAmount;
      monthData[debt.status] += remainingAmount;
    }
  });

  // Convert map to array and sort by month
  const lineChartData = Array.from(debtsByMonth.values());
  
  // Chart config for styling
  const config = {
    pending: { 
      label: 'ממתינים',
      theme: { light: '#FCD34D', dark: '#FCD34D' } 
    },
    overdue: { 
      label: 'באיחור',
      theme: { light: '#EF4444', dark: '#EF4444' } 
    },
    partially_paid: { 
      label: 'שולמו חלקית',
      theme: { light: '#60A5FA', dark: '#60A5FA' } 
    },
    total: { 
      label: 'סך הכל',
      theme: { light: '#8884d8', dark: '#8884d8' } 
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>התפלגות חובות לפי סטטוס</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {filteredPieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredPieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {filteredPieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">אין מספיק נתונים להצגה</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>חובות לאורך זמן</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {lineChartData.length > 0 ? (
            <ChartContainer className="h-full" config={config}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis width={60} tickFormatter={(value) => `₪${value}`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="total" name="סך הכל" stroke="#8884d8" />
                <Line type="monotone" dataKey="pending" name="ממתינים" stroke="#FCD34D" />
                <Line type="monotone" dataKey="overdue" name="באיחור" stroke="#EF4444" />
                <Line type="monotone" dataKey="partially_paid" name="שולמו חלקית" stroke="#60A5FA" />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">אין מספיק נתונים להצגה</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
