"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { Users, Home, Mail, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalInquiries: number;
  monthlyInquiries: number;
  activeListings: number;
  pendingApprovals: number;
}

const userGrowthData = [
  { month: "Jan", users: 100 },
  { month: "Feb", users: 150 },
  { month: "Mar", users: 200 },
  { month: "Apr", users: 280 },
  { month: "May", users: 350 },
  { month: "Jun", users: 420 },
];

const inquiriesData = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 25 },
  { day: "Thu", count: 20 },
  { day: "Fri", count: 30 },
  { day: "Sat", count: 22 },
  { day: "Sun", count: 15 },
];

const propertiesByCategoryData = [
  { name: "Sale", value: 150, color: "#0A2463" },
  { name: "Rent", value: 100, color: "#247BA0" },
  { name: "Lease", value: 50, color: "#D4AF37" },
];

const activityData = [
  { id: 1, user: "John Doe", action: "Created new property", time: "5 minutes ago" },
  { id: 2, user: "Jane Smith", action: "Updated profile", time: "15 minutes ago" },
  { id: 3, user: "Admin", action: "Approved property listing", time: "30 minutes ago" },
  { id: 4, user: "Bob Johnson", action: "Submitted inquiry", time: "1 hour ago" },
  { id: 5, user: "Alice Brown", action: "Registered as new agent", time: "2 hours ago" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProperties: 0,
    totalInquiries: 0,
    monthlyInquiries: 0,
    activeListings: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setStats({
            totalUsers: 1234,
            totalProperties: 456,
            totalInquiries: 789,
            monthlyInquiries: 120,
            activeListings: 389,
            pendingApprovals: 8,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          totalUsers: 1234,
          totalProperties: 456,
          totalInquiries: 789,
          monthlyInquiries: 120,
          activeListings: 389,
          pendingApprovals: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the platform management dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12% from last month"
          icon={<Users className="w-6 h-6 text-primary" />}
          iconBgColor="bg-primary/10"
          valueColor="text-primary"
        />
        <StatCard
          title="Total Properties"
          value={stats.totalProperties.toLocaleString()}
          change="+8% from last month"
          icon={<Home className="w-6 h-6 text-accent" />}
          iconBgColor="bg-accent/10"
          valueColor="text-accent"
        />
        <StatCard
          title="Inquiries (This Month)"
          value={stats.monthlyInquiries.toLocaleString()}
          change="+15% from last month"
          icon={<Mail className="w-6 h-6 text-secondary" />}
          iconBgColor="bg-secondary/10"
          valueColor="text-secondary"
        />
        <StatCard
          title="Active Listings"
          value={stats.activeListings.toLocaleString()}
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          iconBgColor="bg-emerald-100"
          valueColor="text-emerald-600"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals.toLocaleString()}
          icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
          valueColor="text-yellow-600"
        />
        <StatCard
          title="Total Revenue (YTD)"
          value="$2.4M"
          change="+18% from last year"
          icon={<DollarSign className="w-6 h-6 text-primary" />}
          iconBgColor="bg-primary/10"
          valueColor="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#0A2463" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Daily Inquiries</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inquiriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#247BA0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Properties by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertiesByCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {propertiesByCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activityData.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
