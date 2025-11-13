"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/admin/common";
import { CalendarRange } from "lucide-react";

interface AnalyticsData {
  totalMetrics: {
    users: number;
    properties: number;
    inquiries: number;
    revenue: number;
  };
  monthlyMetrics: {
    users: number;
    properties: number;
    inquiries: number;
    revenue: number;
    conversions: number;
  };
  growth: {
    users: number;
    properties: number;
    inquiries: number;
  };
  userGrowth: { month: string; users: number }[];
  newProperties: { week: string; properties: number }[];
  inquiriesTrend: { week: string; inquiries: number }[];
  conversionRate: { month: string; rate: number }[];
  propertiesByCategory: { category: string; value: number }[];
  propertiesByStatus: { status: string; value: number }[];
  agentPerformance: { agent: string; deals: number; revenue: number }[];
}

const pieColors = ["#0A2463", "#247BA0", "#D4AF37", "#5A5D9D", "#1f2937"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        setAnalytics(generateMockAnalytics());
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = (): AnalyticsData => ({
    totalMetrics: {
      users: 4521,
      properties: 786,
      inquiries: 1285,
      revenue: 2.75,
    },
    monthlyMetrics: {
      users: 320,
      properties: 98,
      inquiries: 420,
      revenue: 0.32,
      conversions: 68,
    },
    growth: {
      users: 12.5,
      properties: 8.2,
      inquiries: 15.7,
    },
    userGrowth: [
      { month: "Jan", users: 180 },
      { month: "Feb", users: 230 },
      { month: "Mar", users: 270 },
      { month: "Apr", users: 320 },
      { month: "May", users: 360 },
      { month: "Jun", users: 420 },
    ],
    newProperties: [
      { week: "Week 1", properties: 25 },
      { week: "Week 2", properties: 32 },
      { week: "Week 3", properties: 28 },
      { week: "Week 4", properties: 35 },
    ],
    inquiriesTrend: [
      { week: "Week 1", inquiries: 80 },
      { week: "Week 2", inquiries: 95 },
      { week: "Week 3", inquiries: 110 },
      { week: "Week 4", inquiries: 135 },
    ],
    conversionRate: [
      { month: "Jan", rate: 2.1 },
      { month: "Feb", rate: 2.4 },
      { month: "Mar", rate: 2.7 },
      { month: "Apr", rate: 3.1 },
      { month: "May", rate: 3.4 },
      { month: "Jun", rate: 3.8 },
    ],
    propertiesByCategory: [
      { category: "Sale", value: 420 },
      { category: "Rent", value: 280 },
      { category: "Lease", value: 86 },
    ],
    propertiesByStatus: [
      { status: "Active", value: 520 },
      { status: "Pending", value: 120 },
      { status: "Sold", value: 98 },
      { status: "Rented", value: 48 },
    ],
    agentPerformance: [
      { agent: "Ava Martinez", deals: 22, revenue: 1.2 },
      { agent: "James Carter", deals: 18, revenue: 0.95 },
      { agent: "Sophia Lee", deals: 15, revenue: 0.87 },
      { agent: "Michael Brown", deals: 12, revenue: 0.76 },
    ],
  });

  const handleExportReport = (format: "csv" | "pdf") => {
    // Placeholder for actual export functionality
    console.log(`Exporting analytics report as ${format}`);
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive platform performance insights</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-3">
            <CalendarRange className="w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
            />
          </div>
          <button
            onClick={() => handleExportReport("csv")}
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExportReport("pdf")}
            className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Users"
          value={analytics.totalMetrics.users.toLocaleString()}
          change={`+${analytics.growth.users}% growth`}
          valueColor="text-primary"
        />
        <StatCard
          title="Total Properties"
          value={analytics.totalMetrics.properties.toLocaleString()}
          change={`+${analytics.growth.properties}% growth`}
          valueColor="text-accent"
        />
        <StatCard
          title="Total Inquiries"
          value={analytics.totalMetrics.inquiries.toLocaleString()}
          change={`+${analytics.growth.inquiries}% growth`}
          valueColor="text-secondary"
        />
        <StatCard
          title="Revenue (M)"
          value={`$${analytics.totalMetrics.revenue.toFixed(2)}M`}
          change="+18% YoY"
          valueColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={analytics.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#0A2463" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">New Properties Per Week</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics.newProperties}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="properties" fill="#247BA0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Inquiries Trend</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={analytics.inquiriesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inquiries" stroke="#D4AF37" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Conversion Rate Trend</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={analytics.conversionRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit="%" />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#5A5D9D" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Properties by Category</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={analytics.propertiesByCategory} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={110} label>
                {analytics.propertiesByCategory.map((entry, index) => (
                  <Cell key={`category-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Properties by Status</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={analytics.propertiesByStatus} dataKey="value" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={110} label>
                {analytics.propertiesByStatus.map((entry, index) => (
                  <Cell key={`status-${index}`} fill={pieColors[(index + 2) % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Agent Performance Rankings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-border">
              <tr className="text-left text-sm font-semibold text-foreground">
                <th className="px-3 py-3">Agent</th>
                <th className="px-3 py-3">Deals Closed</th>
                <th className="px-3 py-3">Revenue (M)</th>
                <th className="px-3 py-3">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.agentPerformance.map((agent) => (
                <tr key={agent.agent} className="border-b border-border text-sm">
                  <td className="px-3 py-3 font-medium text-foreground">{agent.agent}</td>
                  <td className="px-3 py-3">{agent.deals}</td>
                  <td className="px-3 py-3">${agent.revenue.toFixed(2)}</td>
                  <td className="px-3 py-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-primary"
                        style={{ width: `${Math.min(100, (agent.revenue / analytics.agentPerformance[0].revenue) * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
