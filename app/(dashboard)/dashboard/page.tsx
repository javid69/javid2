export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Properties
              </p>
              <p className="text-3xl font-bold text-primary">12</p>
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
              <p className="text-3xl font-bold text-accent">8</p>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unread Messages</p>
              <p className="text-3xl font-bold text-secondary">5</p>
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { action: "New inquiry on Property #123", time: "2 hours ago" },
              { action: "Property #456 listing updated", time: "5 hours ago" },
              { action: "New message from John Doe", time: "1 day ago" },
              { action: "Property #789 marked as sold", time: "2 days ago" },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <span className="text-foreground">{activity.action}</span>
                <span className="text-sm text-muted-foreground">
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
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Add Property
            </button>
            <button className="border border-input py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
              View Analytics
            </button>
            <button className="border border-input py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
              Manage Listings
            </button>
            <button className="border border-input py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
              View Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
