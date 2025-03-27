export interface NewsItem {
  id: string
  title: string
  description: string
  author: string
  publishedAt: string
  source: string
  type: "news" | "blog"
  url: string
}

