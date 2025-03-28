"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import VisualizationDashboard from "@/components/visualization-dashboard"
import { useQueryStore } from "@/lib/store"
import "./page.css"

export default function VisualizePage() {
  const router = useRouter()
  const { data, columns } = useQueryStore()

  // Redirect to home if no data is available
  useEffect(() => {
    if (data.length === 0) {
      router.push("/")
    }
  }, [data, router])

  return (
    <div className="container">
      <div className="page-header">
        <h1>Data Visualization Dashboard</h1>
        <Link href="/" className="button button-outline">
          <ChevronLeft className="icon" />
          Back to Query Runner
        </Link>
      </div>

      {data.length > 0 ? (
        <div className="card">
          <VisualizationDashboard />
        </div>
      ) : (
        <div className="card empty-state">
          <p className="empty-title">No data available for visualization.</p>
          <p className="empty-subtitle">Run a query in the SQL Query Runner first.</p>
          <Link href="/" className="button button-primary">
            Go to Query Runner
          </Link>
        </div>
      )}
    </div>
  )
}

