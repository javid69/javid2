export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold text-primary">1,234</p>
              <p className="text-xs text-accent mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Properties</p>
              <p className="text-3xl font-bold text-accent">456</p>
              <p className="text-xs text-accent mt-1">+8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Agents</p>
              <p className="text-3xl font-bold text-secondary">89</p>
              <p className="text-xs text-accent mt-1">+5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Revenue (YTD)</p>
              <p className="text-3xl font-bold text-primary">$2.4M</p>
              <p className="text-xs text-accent mt-1">+18% from last year</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Recent Users
          </h2>
          <div className="space-y-4">
            {[
              { name: "John Doe", email: "john@example.com", role: "USER" },
              { name: "Jane Smith", email: "jane@example.com", role: "AGENT" },
              { name: "Bob Johnson", email: "bob@example.com", role: "USER" },
              { name: "Alice Brown", email: "alice@example.com", role: "AGENT" },
            ].map((user, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            System Status
          </h2>
          <div className="space-y-4">
            {[
              { service: "Database", status: "Operational" },
              { service: "API Server", status: "Operational" },
              { service: "File Storage", status: "Operational" },
              { service: "Email Service", status: "Operational" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <span className="font-medium text-foreground">{item.service}</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  <span className="text-sm text-accent">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
