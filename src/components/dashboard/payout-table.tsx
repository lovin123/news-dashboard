"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchNewsData } from "@/lib/news-api";
import type { NewsItem } from "@/types/news";
import type { PayoutSettings } from "@/types/payout";

interface AuthorPayout {
  author: string;
  newsCount: number;
  blogCount: number;
  totalArticles: number;
  newsPayout: number;
  blogPayout: number;
  totalPayout: number;
}

export function PayoutTable() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    newsRate: 50,
    blogRate: 75,
  });
  const [authorPayouts, setAuthorPayouts] = useState<AuthorPayout[]>([]);

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

  // Calculate author payouts when data or settings change
  useEffect(() => {
    if (newsData.length === 0) return;

    const authorMap = new Map<string, AuthorPayout>();

    newsData.forEach((item) => {
      const author = item.author;
      const isNews = item.type === "news";

      if (!authorMap.has(author)) {
        authorMap.set(author, {
          author,
          newsCount: 0,
          blogCount: 0,
          totalArticles: 0,
          newsPayout: 0,
          blogPayout: 0,
          totalPayout: 0,
        });
      }

      const authorData = authorMap.get(author)!;

      if (isNews) {
        authorData.newsCount++;
        authorData.newsPayout += payoutSettings.newsRate;
      } else {
        authorData.blogCount++;
        authorData.blogPayout += payoutSettings.blogRate;
      }

      authorData.totalArticles++;
      authorData.totalPayout = authorData.newsPayout + authorData.blogPayout;

      authorMap.set(author, authorData);
    });

    setAuthorPayouts(Array.from(authorMap.values()));
  }, [newsData, payoutSettings]);

  return (
    <div className="rounded-lg border bg-card">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">News Articles</TableHead>
              <TableHead className="text-right">Blog Posts</TableHead>
              <TableHead className="text-right">Total Articles</TableHead>
              <TableHead className="text-right">News Payout ($)</TableHead>
              <TableHead className="text-right">Blog Payout ($)</TableHead>
              <TableHead className="text-right">Total Payout ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading payout data...
                </TableCell>
              </TableRow>
            ) : authorPayouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No payout data available.
                </TableCell>
              </TableRow>
            ) : (
              authorPayouts.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.author}</TableCell>
                  <TableCell className="text-right">{item.newsCount}</TableCell>
                  <TableCell className="text-right">{item.blogCount}</TableCell>
                  <TableCell className="text-right">
                    {item.totalArticles}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.newsPayout.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.blogPayout.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${item.totalPayout.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
