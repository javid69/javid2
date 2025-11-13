"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "@/components/agent/MetricCard";
import { Button } from "@/components/ui/Button";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Home,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

interface TopProperty {
  title: string;
  city: string;
  views: number;
  inquiries: number;
}

interface Analytics {
  totalProperties: number;
  totalViews: number;
  totalInquiries: number;
  conversionRate: number;
  topProperties: TopProperty[];
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"30" | "90" | "all">("30");
  const [analytics, setAnalytics] = useState<Analytics>({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    conversionRate: 0,
    topProperties: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agent/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAnalytics = async () => {
      await fetchAnalytics();
    };
    initAnalytics();
  }, [timeRange]);

  const handleExport = () => {
    const data = JSON.stringify(analytics, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your property performance and inquiries
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as "30" | "90" | "all")}
            className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Total Properties"
              value={analytics.totalProperties}
              icon={<Home className="w-6 h-6" />}
              variant="primary"
            />
            <MetricCard
              label="Total Views"
              value={analytics.totalViews}
              icon={<TrendingUp className="w-6 h-6" />}
              variant="secondary"
            />
            <MetricCard
              label="Total Inquiries"
              value={analytics.totalInquiries}
              icon={<MessageSquare className="w-6 h-6" />}
              variant="accent"
            />
            <MetricCard
              label="Conversion Rate"
              value={`${analytics.conversionRate.toFixed(1)}%`}
              icon={<BarChart3 className="w-6 h-6" />}
              variant="primary"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Top Performing Properties
            </h2>
            {analytics.topProperties.length === 0 ? (
              <p className="text-muted-foreground">No data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.topProperties.map((property: TopProperty, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {property.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {property.views} views
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property.inquiries} inquiries
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
