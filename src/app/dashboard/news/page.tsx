import { NewsFilters } from "@/components/dashboard/news-filters"
import { NewsTable } from "@/components/dashboard/news-table"

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">News & Blogs</h1>
      </div>
      <NewsFilters />
      <NewsTable />
    </div>
  )
}

