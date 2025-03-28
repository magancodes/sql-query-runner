"use client"
import "./QueryHistory.css"

function QueryHistory({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <div className="query-history">
        <div className="no-history">No query history yet. Run some queries to see them here.</div>
      </div>
    )
  }

  const formatTime = (date) => {
    // Simple relative time formatting
    const now = new Date()
    const diff = now - new Date(date)

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  const truncateQuery = (query) => {
    return query.length > 150 ? `${query.substring(0, 150)}...` : query
  }

  return (
    <div className="query-history">
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-item-header">
              <div className="history-timestamp">{formatTime(item.timestamp)}</div>
              <button className="button secondary-button small-button" onClick={() => onSelect(item.query)}>
                Use
              </button>
            </div>
            <pre className="history-query">{truncateQuery(item.query)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueryHistory

