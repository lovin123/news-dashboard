import { DashboardOverview } from "@/components/dashboard/overview"
import { NewsAnalytics } from "@/components/dashboard/news-analytics"
import { RecentNews } from "@/components/dashboard/recent-news"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardOverview />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewsAnalytics />
        <RecentNews />
      </div>
    </div>
  )
}

