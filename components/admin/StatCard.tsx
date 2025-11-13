"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  valueColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  iconBgColor = "bg-primary/10",
  valueColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
          {change && (
            <p className="text-xs text-accent mt-1">{change}</p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center flex-shrink-0 ml-4`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
