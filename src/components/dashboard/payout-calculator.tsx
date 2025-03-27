"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchNewsData } from "@/lib/news-api";
import type { NewsItem } from "@/types/news";
import type { PayoutSettings } from "@/types/payout";

export function PayoutCalculator() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    newsRate: 50,
    blogRate: 75,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNewsData();
        setNewsData(data);
      } catch (error) {
        console.error("Failed to fetch news data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load payout settings from localStorage
    const savedSettings = localStorage.getItem("payoutSettings");
    if (savedSettings) {
      setPayoutSettings(JSON.parse(savedSettings));
    }

    loadData();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("payoutSettings", JSON.stringify(payoutSettings));
  }, [payoutSettings]);

  // Calculate totals
  const totalNewsArticles = newsData.filter(
    (item) => item.type === "news"
  ).length;
  const totalBlogPosts = newsData.filter((item) => item.type === "blog").length;
  const totalNewsPayout = totalNewsArticles * payoutSettings.newsRate;
  const totalBlogPayout = totalBlogPosts * payoutSettings.blogRate;
  const totalPayout = totalNewsPayout + totalBlogPayout;

  const handleRateChange = (type: "newsRate" | "blogRate", value: string) => {
    const numValue = Number.parseFloat(value) || 0;
    setPayoutSettings((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Calculator</CardTitle>
        <CardDescription>
          Set payout rates for different content types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="news-rate">News Article Rate ($)</Label>
            <Input
              id="news-rate"
              type="number"
              min="0"
              step="0.01"
              value={payoutSettings.newsRate}
              onChange={(e) => handleRateChange("newsRate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-rate">Blog Post Rate ($)</Label>
            <Input
              id="blog-rate"
              type="number"
              min="0"
              step="0.01"
              value={payoutSettings.blogRate}
              onChange={(e) => handleRateChange("blogRate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Total Articles</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-2">
                <div className="text-xs text-muted-foreground">News</div>
                <div className="text-lg font-bold">
                  {isLoading ? "..." : totalNewsArticles}
                </div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-xs text-muted-foreground">Blogs</div>
                <div className="text-lg font-bold">
                  {isLoading ? "..." : totalBlogPosts}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Total Payout</Label>
            <div className="rounded-lg border bg-primary/10 p-2">
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="text-lg font-bold">
                {isLoading ? "..." : `$${totalPayout.toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
