interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
}

export function MetricCard({
  label,
  value,
  icon,
  variant = "primary",
}: MetricCardProps) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
