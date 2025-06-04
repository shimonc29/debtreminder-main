
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, UserPlus, Users } from 'lucide-react';
import { getSystemStats, getUserGrowthData } from '@/lib/db';
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const stats = getSystemStats();
  const growthData = getUserGrowthData();

  return (
    <AdminLayout title="דשבורד מנהל">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ משתמשים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} פעילים מתוך {stats.totalUsers}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">משתמשים חדשים החודש</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersThisMonth} מהחודש הקודם
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ חובות</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDebts}</div>
            <p className="text-xs text-muted-foreground">
              מעקב אחר {stats.totalDebts} חובות במערכת
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">יעילות תזכורות</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.remindersEfficiency}%</div>
            <p className="text-xs text-muted-foreground">
              +2% מהחודש שעבר
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>צמיחת משתמשים</CardTitle>
            <CardDescription>התפלגות משתמשים חדשים לפי חודשים</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>פעילות מערכת</CardTitle>
            <CardDescription>תזכורות ותשובות לפי חודש</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { month: "ינואר", תזכורות: 40, תשובות: 24 },
                  { month: "פברואר", תזכורות: 30, תשובות: 13 },
                  { month: "מרץ", תזכורות: 60, תשובות: 45 },
                  { month: "אפריל", תזכורות: 70, תשובות: 55 },
                  { month: "מאי", תזכורות: 90, תשובות: 70 }
                ]}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="תזכורות" fill="#8884d8" />
                <Bar dataKey="תשובות" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>דו"ח מערכת</CardTitle>
            <CardDescription>סקירת ביצועי מערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">סה"כ הלקוחות</h3>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">סה"כ תזכורות</h3>
                <p className="text-2xl font-bold">{stats.totalReminders}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">תזכורות שנכשלו</h3>
                <p className="text-2xl font-bold text-destructive">{stats.failedReminders}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">סך הכנסות שנאספו</h3>
                <p className="text-2xl font-bold">₪{stats.revenueCollected.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
