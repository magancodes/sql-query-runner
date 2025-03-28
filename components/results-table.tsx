"use client"

import { useState } from "react"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import "./results-table.css"

interface ResultsTableProps {
  data: any[]
  columns: string[]
  isLoading: boolean
}

export default function ResultsTable({ data, columns, isLoading }: ResultsTableProps) {
  // Update the rowsPerPage constant to handle large datasets better
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 25 // Increased from 10 to 25 to show more rows per page
  const totalPages = Math.ceil(data.length / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // Add a function to handle large datasets in the CSV export
  const exportToCsv = () => {
    if (data.length === 0) return

    // For very large datasets, we might want to limit the export or warn the user
    const dataToExport = data
    if (data.length > 5000) {
      if (!confirm(`This will export ${data.length} rows which may take some time. Continue?`)) {
        return
      }

      // Process the export in chunks to avoid browser freezing
      const exportInChunks = () => {
        const chunkSize = 1000
        const chunks = Math.ceil(data.length / chunkSize)
        let csvContent = columns.join(",") + "\n"

        for (let i = 0; i < chunks; i++) {
          const start = i * chunkSize
          const end = Math.min(start + chunkSize, data.length)
          const chunk = data.slice(start, end)

          csvContent += chunk
            .map((row) =>
              columns
                .map((col) => {
                  const value = row[col]
                  return typeof value === "string" && value.includes(",") ? `"${value}"` : value
                })
                .join(","),
            )
            .join("\n")
        }

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `query_results_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      // Use setTimeout to avoid blocking the UI
      setTimeout(exportInChunks, 100)
      return
    }

    // For smaller datasets, use the original export logic
    const csvContent = [
      columns.join(","),
      ...dataToExport.map((row) =>
        columns
          .map((col) => {
            const value = row[col]
            // Handle values with commas by wrapping in quotes
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `query_results_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="results-table-container">
        <div className="loading-skeleton">
          <div className="skeleton-header">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={`header-${i}`} className="skeleton-cell"></div>
              ))}
          </div>
          {Array(5)
            .fill(0)
            .map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="skeleton-row">
                {Array(5)
                  .fill(0)
                  .map((_, cellIndex) => (
                    <div key={`cell-${rowIndex}-${cellIndex}`} className="skeleton-cell"></div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return <div className="no-results">No results to display. Run a query to see data.</div>
  }

  return (
    <div className="results-table-container">
      <div className="table-actions">
        <div className="table-info">
          Showing {data.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, data.length)} of {data.length} results
          {data.length > 1000 && <span className="large-dataset"> (Large Dataset)</span>}
        </div>
        <button className="button button-outline" onClick={exportToCsv}>
          <Download className="icon" />
          Export CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "alternate-row" : ""}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="button button-outline pagination-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="icon" />
            Previous
          </button>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <button
            className="button button-outline pagination-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="icon-right" />
          </button>
        </div>
      )}
    </div>
  )
}

