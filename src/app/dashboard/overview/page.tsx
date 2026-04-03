export const metadata = { title: "Dashboard — Ruleset" };

export default function DashboardOverviewPage() {
  const stats = [
    { label: "Published Rulesets", value: "0" },
    { label: "Total Downloads", value: "0" },
    { label: "Total Earnings", value: "$0.00" },
    { label: "Followers", value: "0" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-sm text-text-tertiary mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-text-primary mb-4">Recent Activity</h2>
        <p className="text-text-tertiary text-sm">No recent activity. Publish your first ruleset to get started.</p>
      </div>
    </div>
  );
}
