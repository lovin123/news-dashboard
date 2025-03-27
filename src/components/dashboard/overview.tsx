"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Newspaper, BookOpen } from "lucide-react";
import { fetchNewsData } from "@/lib/news-api";
import type { NewsItem } from "@/types/news";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardOverview() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchNewsData();
        setNewsData(data);
      } catch (error) {
        console.error("Failed to fetch news data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const totalArticles = newsData.length;
  const totalAuthors = new Set(newsData.map((item) => item.author)).size;
  const totalNewsArticles = newsData.filter(
    (item) => item.type === "news"
  ).length;
  const totalBlogPosts = newsData.filter((item) => item.type === "blog").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{totalArticles}</div>
              <p className="text-xs text-muted-foreground">From News API</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">News Articles</CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{totalNewsArticles}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((totalNewsArticles / totalArticles) * 100)}% of
                total
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{totalBlogPosts}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((totalBlogPosts / totalArticles) * 100)}% of total
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Authors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{totalAuthors}</div>
              <p className="text-xs text-muted-foreground">
                Contributing to articles
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
