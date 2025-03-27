"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { fetchAuthors } from "@/lib/news-api"

export function NewsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [author, setAuthor] = useState<string>("")
  const [type, setType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [fromDate, setFromDate] = useState<Date | undefined>()
  const [toDate, setToDate] = useState<Date | undefined>()
  const [authors, setAuthors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize filters from URL
  useEffect(() => {
    const authorParam = searchParams.get("author")
    const typeParam = searchParams.get("type")
    const categoryParam = searchParams.get("category")
    const fromDateParam = searchParams.get("fromDate")
    const toDateParam = searchParams.get("toDate")

    if (authorParam) setAuthor(authorParam)
    if (typeParam) setType(typeParam)
    if (categoryParam) setCategory(categoryParam)
    if (fromDateParam) setFromDate(new Date(fromDateParam))
    if (toDateParam) setToDate(new Date(toDateParam))

    // Fetch authors for filter dropdown
    const loadAuthors = async () => {
      setIsLoading(true)
      try {
        const authorsList = await fetchAuthors()
        setAuthors(authorsList.filter((a) => a !== "Unknown Author" && a !== null))
      } catch (error) {
        console.error("Failed to fetch authors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthors()
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    if (author) {
      params.set("author", author)
    } else {
      params.delete("author")
    }

    if (type) {
      params.set("type", type)
    } else {
      params.delete("type")
    }

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    if (fromDate) {
      params.set("fromDate", fromDate.toISOString().split("T")[0])
    } else {
      params.delete("fromDate")
    }

    if (toDate) {
      params.set("toDate", toDate.toISOString().split("T")[0])
    } else {
      params.delete("toDate")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setAuthor("")
    setType("")
    setCategory("")
    setFromDate(undefined)
    setToDate(undefined)

    router.push(pathname)
  }

  const hasActiveFilters = author || type || category || fromDate || toDate

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grid gap-2">
          <Label htmlFor="author">Author</Label>
          <Select value={author} onValueChange={setAuthor}>
            <SelectTrigger id="author" className="w-full md:w-[200px]">
              <SelectValue placeholder="All authors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All authors</SelectItem>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Loading authors...
                </SelectItem>
              ) : (
                authors.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">Content Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type" className="w-full md:w-[200px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="w-full md:w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>From Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[200px]",
                  !fromDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label>To Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[200px]",
                  !toDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 mt-2 md:mt-0">
          <Button onClick={applyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

