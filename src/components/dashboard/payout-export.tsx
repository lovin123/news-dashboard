"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileText,
} from "lucide-react";
import { fetchNewsData } from "@/lib/news-api";
import type { NewsItem } from "@/types/news";
import type { PayoutSettings } from "@/types/payout";
import { useToast } from "@/hooks/use-toast";

interface AuthorPayout {
  author: string;
  newsCount: number;
  blogCount: number;
  totalArticles: number;
  newsPayout: number;
  blogPayout: number;
  totalPayout: number;
}

export function PayoutExport() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    newsRate: 50,
    blogRate: 75,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load payout settings from localStorage
    const savedSettings = localStorage.getItem("payoutSettings");
    if (savedSettings) {
      setPayoutSettings(JSON.parse(savedSettings));
    }
  }, []);

  const calculatePayouts = async (): Promise<AuthorPayout[]> => {
    setIsLoading(true);

    try {
      const data = await fetchNewsData();
      setNewsData(data);

      const authorMap = new Map<string, AuthorPayout>();

      data.forEach((item) => {
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

      setIsLoading(false);
      return Array.from(authorMap.values());
    } catch (error) {
      console.error("Failed to fetch news data:", error);
      setIsLoading(false);
      return [];
    }
  };

  const exportToCSV = async () => {
    const payouts = await calculatePayouts();

    if (payouts.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no payout data available to export.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = [
      "Author",
      "News Articles",
      "Blog Posts",
      "Total Articles",
      "News Payout ($)",
      "Blog Payout ($)",
      "Total Payout ($)",
    ];
    const rows = payouts.map((payout) => [
      payout.author,
      payout.newsCount.toString(),
      payout.blogCount.toString(),
      payout.totalArticles.toString(),
      payout.newsPayout.toFixed(2),
      payout.blogPayout.toFixed(2),
      payout.totalPayout.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payout-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: "The CSV file has been downloaded successfully.",
    });
  };

  const exportToPDF = async () => {
    toast({
      title: "PDF Export",
      description:
        "PDF export functionality would be implemented with a library like jsPDF.",
    });
  };

  const exportToGoogleSheets = async () => {
    toast({
      title: "Google Sheets Export",
      description: "Google Sheets export would require Google API integration.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          {isLoading ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FilePdf className="mr-2 h-4 w-4" />
          Export to PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToGoogleSheets}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Google Sheets
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
