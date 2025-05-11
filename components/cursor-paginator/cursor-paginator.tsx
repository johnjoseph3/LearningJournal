"use client"

import { useState, useEffect } from "react"
import Skeleton from "@/components/skeleton"
interface CursorPaginatorProps<T> {
  endpoint: string
  render: (
    data: T,
    loadMore: () => Promise<void>,
    loading: boolean,
    hasMore: boolean
  ) => React.ReactNode
  mergeData: (currentData: T, newData: T) => T
  getNextCursor: (data: T) => string | null
}

export default function CursorPaginator<T>({
  endpoint,
  render,
  mergeData,
  getNextCursor
}: CursorPaginatorProps<T>) {
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [mergedData, setMergedData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true)
      try {
        const response = await fetch(endpoint)
        const initialData = await response.json()
        setMergedData(initialData)
        setCursor(getNextCursor(initialData))
        setHasMore(!!getNextCursor(initialData))
      } catch (err) {
        console.error("Error fetching initial data:", err)
        setError("Failed to fetch data.")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [endpoint, getNextCursor])

  async function loadMore() {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const response = await fetch(
        endpoint + (cursor ? `&cursor=${cursor}` : "")
      )
      const newData = await response.json()

      const updatedData = mergeData(mergedData as T, newData)
      setMergedData(updatedData)

      const nextCursor = getNextCursor(newData)
      setCursor(nextCursor)
      setHasMore(!!nextCursor)
    } catch (err) {
      console.error("Error loading more data:", err)
      setError("Failed to load more data.")
    } finally {
      setLoading(false)
    }
  }

  if (error)
    return <div>{error || "An error occurred while fetching the data."}</div>

  if (loading && !mergedData) return <Skeleton />

  return <>{render(mergedData as T, loadMore, loading, hasMore)}</>
}
