import { NewsAnalytics } from "@/components/dashboard/news-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <NewsAnalytics />

        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Engagement metrics for your content</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Additional analytics charts would be displayed here</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audience Demographics</CardTitle>
          <CardDescription>Understand your audience better</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Demographic data visualization would be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
}

