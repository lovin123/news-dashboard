"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { fetchNewsData, fetchNewsByCategory, searchNews } from "@/lib/news-api";
import type { NewsItem } from "@/types/news";
import { format, parseISO } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NewsTable() {
  const searchParams = useSearchParams();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [filteredData, setFilteredData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const category = searchParams.get("category");
        const query = searchParams.get("q");

        let data: NewsItem[];

        if (category) {
          // Fetch news by category
          data = await fetchNewsByCategory(category);
        } else if (query) {
          // Search news by keyword
          data = await searchNews(query);
        } else {
          // Fetch top headlines
          data = await fetchNewsData();
        }

        setNewsData(data);
      } catch (error) {
        console.error("Failed to fetch news data:", error);
        setError("Failed to load news data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams.get("category"), searchParams.get("q")]);

  // Apply filters when search params or news data changes
  useEffect(() => {
    if (newsData.length === 0) return;

    const author = searchParams.get("author");
    const type = searchParams.get("type");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const query = searchParams.get("q");

    let filtered = [...newsData];

    if (author) {
      filtered = filtered.filter((item) => item.author === author);
    }

    if (type) {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (fromDate) {
      const fromDateObj = new Date(fromDate);
      filtered = filtered.filter(
        (item) => new Date(item.publishedAt) >= fromDateObj
      );
    }

    if (toDate) {
      const toDateObj = new Date(toDate);
      filtered = filtered.filter(
        (item) => new Date(item.publishedAt) <= toDateObj
      );
    }

    if (query && !searchParams.get("category")) {
      // Only apply client-side filtering if we're not already searching via API
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.author.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchParams, newsData]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5} className="h-12">
                    <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.title}
                    </a>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.type === "news" ? "default" : "secondary"}
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.publishedAt)}</TableCell>
                  <TableCell>{item.source}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                // Show first page, last page, current page, and pages around current
                let pageToShow = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }
                }

                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageToShow)}
                      isActive={currentPage === pageToShow}
                    >
                      {pageToShow}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
