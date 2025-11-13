"use client";

import Link from "next/link";
import { MetricCard } from "@/components/agent/MetricCard";
import { Button } from "@/components/ui/Button";
import { BarChart3, TrendingUp, MessageSquare, Home } from "lucide-react";

export default function AgentDashboard() {
  // TODO: Fetch agent data and metrics from API
  const agentName = "Agent Name";
  const totalProperties = 12;
  const totalViews = 248;
  const totalInquiries = 15;
  const conversionRate = 8.5;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {agentName}&apos;s Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s your dashboard overview for this month
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Total Properties Listed"
          value={totalProperties}
          icon={<Home className="w-6 h-6" />}
          variant="primary"
        />
        <MetricCard
          label="Total Views (This Month)"
          value={totalViews}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="secondary"
        />
        <MetricCard
          label="Total Inquiries (This Month)"
          value={totalInquiries}
          icon={<MessageSquare className="w-6 h-6" />}
          variant="accent"
        />
        <MetricCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          icon={<BarChart3 className="w-6 h-6" />}
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {[
              { action: "New inquiry on Property #123", time: "2 hours ago" },
              {
                action: "Property #456 listing updated",
                time: "5 hours ago",
              },
              { action: "New inquiry from John Doe", time: "1 day ago" },
              { action: "Property #789 marked as sold", time: "2 days ago" },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <span className="text-foreground text-sm">{activity.action}</span>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href="/agent/properties/new" className="block">
              <Button className="w-full" variant="primary">
                ➕ Add New Property
              </Button>
            </Link>
            <Link href="/agent/leads" className="block">
              <Button className="w-full" variant="outline">
                📋 View Inquiries
              </Button>
            </Link>
            <Link href="/agent/analytics" className="block">
              <Button className="w-full" variant="outline">
                📈 View Analytics
              </Button>
            </Link>
            <Link href="/agent/properties" className="block">
              <Button className="w-full" variant="outline">
                🏠 Manage Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
