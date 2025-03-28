"use client"

import { formatDistanceToNow } from "date-fns"
import "./query-history.css"

interface HistoryItem {
  id: string
  query: string
  timestamp: Date
}

interface QueryHistoryProps {
  history: HistoryItem[]
  onSelect: (query: string) => void
}

export default function QueryHistory({ history, onSelect }: QueryHistoryProps) {
  if (history.length === 0) {
    return <div className="no-history">No query history yet. Run some queries to see them here.</div>
  }

  return (
    <div className="query-history">
      {history.map((item) => (
        <div key={item.id} className="history-item">
          <div className="history-item-header">
            <div className="history-timestamp">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </div>
            <button className="history-use-button" onClick={() => onSelect(item.query)}>
              Use
            </button>
          </div>
          <pre className="history-query">
            {item.query.length > 150 ? `${item.query.substring(0, 150)}...` : item.query}
          </pre>
        </div>
      ))}
    </div>
  )
}

