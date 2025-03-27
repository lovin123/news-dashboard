"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchNewsData } from "@/lib/news-api"
import type { NewsItem } from "@/types/news"
import { formatDistanceToNow, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Newspaper, BookOpen, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentNews() {
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchNewsData()
        setNewsData(data)
      } catch (error) {
        console.error("Failed to fetch news data:", error)
        setError("Failed to load recent news. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent News & Blogs</CardTitle>
        <CardDescription>Latest articles from your sources</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {newsData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="rounded-md bg-muted p-2">
                  {item.type === "news" ? <Newspaper className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {item.title}
                      </a>
                    </p>
                    <Badge variant="outline" className="ml-auto">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By {item.author} • {formatDate(item.publishedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

