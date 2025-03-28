"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, BarChart } from "lucide-react"
import QueryEditor from "./query-editor"
import ResultsTable from "./results-table"
import QuerySelector from "./query-selector"
import QueryHistory from "./query-history"
import { predefinedQueries } from "@/lib/sample-queries"
import { generateMockData } from "@/lib/mock-data"
import { useQueryStore } from "@/lib/store"
import "./query-runner.css"

export default function QueryRunner() {
  const router = useRouter()
  const { setData, setColumns } = useQueryStore()

  const [currentQuery, setCurrentQuery] = useState(predefinedQueries[0].query)
  const [selectedQueryId, setSelectedQueryId] = useState(predefinedQueries[0].id)
  const [results, setResults] = useState<any[]>([])
  const [columns, setLocalColumns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [history, setHistory] = useState<Array<{ id: string; query: string; timestamp: Date }>>([])

  // Load the initial query results
  useEffect(() => {
    executeQuery(currentQuery)
  }, [])

  const executeQuery = (query: string) => {
    setIsLoading(true)
    const startTime = performance.now()

    try {
      // Generate mock data based on the query
      const queryLower = query.toLowerCase()
      let mockData

      if (queryLower.includes("users")) {
        mockData = generateMockData("users", 100)
      } else if (queryLower.includes("orders")) {
        mockData = generateMockData("orders", 100)
      } else if (queryLower.includes("products")) {
        mockData = generateMockData("products", 100)
      } else if (queryLower.includes("customers")) {
        mockData = generateMockData("customers", 100)
      } else if (queryLower.includes("transaction_logs")) {
        mockData = generateMockData("transaction_logs", 10000) // Handle the large transaction logs query
      } else {
        mockData = generateMockData("generic", 100)
      }

      setResults(mockData.data)
      setLocalColumns(mockData.columns)

      // Update the store with the results
      setData(mockData.data)
      setColumns(mockData.columns)

      const endTime = performance.now()
      setExecutionTime(endTime - startTime)

      // Add to history
      const newHistoryItem = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
      }
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10))
    } catch (error) {
      console.error("Error executing query:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuerySelect = (id: string) => {
    const selected = predefinedQueries.find((q) => q.id === id)
    if (selected) {
      setCurrentQuery(selected.query)
      setSelectedQueryId(id)
    }
  }

  const handleRunQuery = () => {
    executeQuery(currentQuery)
  }

  const handleHistorySelect = (query: string) => {
    setCurrentQuery(query)
    setActiveTab("editor")
  }

  const navigateToVisualize = () => {
    if (results.length > 0) {
      router.push("/visualize")
    }
  }

  return (
    <div className="query-runner">
      <div className="query-selector-container">
        <QuerySelector queries={predefinedQueries} selectedId={selectedQueryId} onSelect={handleQuerySelect} />
      </div>

      <div className="tabs">
        <div className="tab-list">
          <button
            className={`tab-button ${activeTab === "editor" ? "active" : ""}`}
            onClick={() => setActiveTab("editor")}
          >
            Query Editor
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "editor" && (
            <div className="tab-panel">
              <QueryEditor value={currentQuery} onChange={setCurrentQuery} />
              <div className="query-actions">
                <button className="button button-primary" onClick={handleRunQuery} disabled={isLoading}>
                  <Play className="icon" />
                  Run Query
                </button>

                <button
                  className="button button-success visualize-button"
                  onClick={navigateToVisualize}
                  disabled={results.length === 0}
                >
                  <BarChart className="icon" />
                  Visualize Data
                </button>

                {executionTime && <div className="execution-time">Executed in {executionTime.toFixed(2)}ms</div>}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="tab-panel">
              <QueryHistory history={history} onSelect={handleHistorySelect} />
            </div>
          )}
        </div>
      </div>

      <div className="results-container">
        <h2>Results</h2>
        <ResultsTable data={results} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  )
}

