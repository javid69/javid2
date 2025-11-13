"use client";

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

interface LineChartData {
  [key: string]: string | number;
}

interface PieChartData {
  name: string;
  value: number;
}

interface AnalyticsLineChartProps {
  data: LineChartData[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}

export function AnalyticsLineChart({
  data,
  dataKey,
  xKey,
  color = "#0A2463",
  height = 320,
}: AnalyticsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface AnalyticsBarChartProps {
  data: LineChartData[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}

export function AnalyticsBarChart({
  data,
  dataKey,
  xKey,
  color = "#247BA0",
  height = 320,
}: AnalyticsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface AnalyticsPieChartProps {
  data: PieChartData[];
  colors?: string[];
  height?: number;
  innerRadius?: number;
}

const defaultColors = ["#0A2463", "#247BA0", "#D4AF37", "#5A5D9D", "#1f2937"];

export function AnalyticsPieChart({
  data,
  colors = defaultColors,
  height = 320,
  innerRadius = 0,
}: AnalyticsPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={110}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
