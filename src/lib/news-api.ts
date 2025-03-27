import type { NewsItem } from "@/types/news";

// Mock news data as fallback if API fails
const mockNewsData: NewsItem[] = [
  {
    id: "1",
    title: "New Breakthrough in Renewable Energy",
    description:
      "Scientists discover a new method for efficient solar energy conversion.",
    author: "Jane Smith",
    publishedAt: "2023-03-15T10:30:00Z",
    source: "Science Daily",
    type: "news",
    url: "https://example.com/news/1",
  },
  {
    id: "2",
    title: "The Future of AI in Healthcare",
    description:
      "How artificial intelligence is transforming medical diagnostics and treatment.",
    author: "John Doe",
    publishedAt: "2023-03-14T08:45:00Z",
    source: "Tech Insights",
    type: "blog",
    url: "https://example.com/blog/2",
  },
  {
    id: "3",
    title: "Global Markets React to Economic Policy Changes",
    description:
      "Stock markets worldwide show volatility following new economic policies.",
    author: "Michael Johnson",
    publishedAt: "2023-03-13T14:20:00Z",
    source: "Financial Times",
    type: "news",
    url: "https://example.com/news/3",
  },
  {
    id: "4",
    title: "5 Tips for Remote Work Productivity",
    description: "Expert advice on staying productive while working from home.",
    author: "Sarah Williams",
    publishedAt: "2023-03-12T11:15:00Z",
    source: "Work Lifestyle",
    type: "blog",
    url: "https://example.com/blog/4",
  },
  {
    id: "5",
    title: "New Study Links Diet to Mental Health",
    description:
      "Research shows strong correlation between nutrition and psychological wellbeing.",
    author: "David Chen",
    publishedAt: "2023-03-11T09:30:00Z",
    source: "Health Journal",
    type: "news",
    url: "https://example.com/news/5",
  },
];

// Fetch real news data from News API
export async function fetchNewsData(): Promise<NewsItem[]> {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
      console.warn("NEWS_API_KEY not found, using mock data");
      return Promise.resolve(mockNewsData);
    }

    // Fetch top headlines from News API
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to match our app's data model
    const newsItems: NewsItem[] = data.articles.map(
      (article: any, index: number) => ({
        id: index.toString(),
        title: article.title || "Untitled",
        description: article.description || "No description available",
        author: article.author || "Unknown Author",
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: article.source?.name || "Unknown Source",
        // Randomly assign type for demo purposes - in a real app, you'd have a way to determine this
        type: Math.random() > 0.5 ? "news" : "blog",
        url: article.url || "#",
      })
    );

    return newsItems;
  } catch (error) {
    console.error("Error fetching news data:", error);
    // Fallback to mock data if API fails
    return mockNewsData;
  }
}

// Get unique authors for filter dropdown
export async function fetchAuthors(): Promise<string[]> {
  const data = await fetchNewsData();
  const authors = new Set(data.map((item) => item.author));
  return Array.from(authors);
}

// Fetch news by category
export async function fetchNewsByCategory(
  category: string
): Promise<NewsItem[]> {
  try {
    if (!process.env.NEWS_API_KEY) {
      return Promise.resolve(mockNewsData);
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();

    const newsItems: NewsItem[] = data.articles.map(
      (article: any, index: number) => ({
        id: index.toString(),
        title: article.title || "Untitled",
        description: article.description || "No description available",
        author: article.author || "Unknown Author",
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: article.source?.name || "Unknown Source",
        type:
          category === "technology" || category === "science" ? "blog" : "news",
        url: article.url || "#",
      })
    );

    return newsItems;
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return mockNewsData;
  }
}

// Search news by keyword
export async function searchNews(query: string): Promise<NewsItem[]> {
  try {
    if (!process.env.NEWS_API_KEY) {
      return Promise.resolve(
        mockNewsData.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&apiKey=${process.env.NEWS_API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();

    const newsItems: NewsItem[] = data.articles.map(
      (article: any, index: number) => ({
        id: index.toString(),
        title: article.title || "Untitled",
        description: article.description || "No description available",
        author: article.author || "Unknown Author",
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: article.source?.name || "Unknown Source",
        // Determine type based on source or content
        type:
          article.source?.name?.includes("Blog") ||
          article.title?.includes("Opinion") ||
          Math.random() > 0.6
            ? "blog"
            : "news",
        url: article.url || "#",
      })
    );

    return newsItems;
  } catch (error) {
    console.error("Error searching news:", error);
    return mockNewsData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}
