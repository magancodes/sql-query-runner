"use client"

import { useState } from "react"
import "./ResultsTable.css"

function ResultsTable({ data, columns, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentPageData = data.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const exportToCsv = () => {
    if (data.length === 0) return

    const csvContent = [
      columns.join(","),
      ...data.map((row) =>
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
    return (
      <div className="results-table-container">
        <div className="no-results">No results to display. Run a query to see data.</div>
      </div>
    )
  }

  return (
    <div className="results-table-container">
      <div className="table-actions">
        <div className="table-info">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
        </div>
        <button className="button secondary-button" onClick={exportToCsv}>
          <span className="icon">📥</span>
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
            {currentPageData.map((row, rowIndex) => (
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
          <button className="button secondary-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
            ← Previous
          </button>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <button className="button secondary-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default ResultsTable

