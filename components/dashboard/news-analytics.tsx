"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchNewsData } from "@/lib/news-api"
import type { NewsItem } from "@/types/news"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
  ChartTooltipTitle,
} from "@/components/ui/chart"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NewsAnalytics() {
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
        setError("Failed to load analytics data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Prepare data for charts
  const authorData = newsData.reduce(
    (acc, item) => {
      const author = item.author || "Unknown"
      const existingAuthor = acc.find((a) => a.name === author)

      if (existingAuthor) {
        existingAuthor.value++
      } else {
        acc.push({ name: author, value: 1 })
      }

      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Sort author data by value (descending)
  authorData.sort((a, b) => b.value - a.value)

  const typeData = newsData.reduce(
    (acc, item) => {
      const type = item.type || "Unknown"
      const existingType = acc.find((t) => t.name === type)

      if (existingType) {
        existingType.value++
      } else {
        acc.push({ name: type, value: 1 })
      }

      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Prepare source data
  const sourceData = newsData.reduce(
    (acc, item) => {
      const source = item.source || "Unknown"
      const existingSource = acc.find((s) => s.name === source)

      if (existingSource) {
        existingSource.value++
      } else {
        acc.push({ name: source, value: 1 })
      }

      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Sort source data by value (descending) and take top 5
  sourceData.sort((a, b) => b.value - a.value)
  const topSourceData = sourceData.slice(0, 5)

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>News Analytics</CardTitle>
        <CardDescription>Visualize news and blog trends by author, type, and source</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="authors">
            <TabsList className="mb-4">
              <TabsTrigger value="authors">By Author</TabsTrigger>
              <TabsTrigger value="types">By Type</TabsTrigger>
              <TabsTrigger value="sources">By Source</TabsTrigger>
            </TabsList>
            <TabsContent value="authors" className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : authorData.length === 0 ? (
                <div className="flex h-full items-center justify-center">No author data available</div>
              ) : (
                <ChartContainer>
                  <Chart>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={authorData.slice(0, 5)}>
                        <Bar dataKey="value" fill="#8884d8" name="Articles" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <ChartTooltipTitle>Author</ChartTooltipTitle>
                      <ChartTooltipItem label="Articles" value="" color="#8884d8" />
                    </ChartTooltipContent>
                  </ChartTooltip>
                  <ChartLegend />
                </ChartContainer>
              )}
            </TabsContent>
            <TabsContent value="types" className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : typeData.length === 0 ? (
                <div className="flex h-full items-center justify-center">No type data available</div>
              ) : (
                <ChartContainer>
                  <Chart>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <ChartTooltipTitle>Content Type</ChartTooltipTitle>
                      <ChartTooltipItem label="Count" value="" color="#8884d8" />
                    </ChartTooltipContent>
                  </ChartTooltip>
                  <ChartLegend />
                </ChartContainer>
              )}
            </TabsContent>
            <TabsContent value="sources" className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : topSourceData.length === 0 ? (
                <div className="flex h-full items-center justify-center">No source data available</div>
              ) : (
                <ChartContainer>
                  <Chart>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topSourceData}>
                        <Bar dataKey="value" fill="#00C49F" name="Articles" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <ChartTooltipTitle>Source</ChartTooltipTitle>
                      <ChartTooltipItem label="Articles" value="" color="#00C49F" />
                    </ChartTooltipContent>
                  </ChartTooltip>
                  <ChartLegend />
                </ChartContainer>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

