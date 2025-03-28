"use client"
import "./QuerySelector.css"

function QuerySelector({ queries, selectedId, onSelect }) {
  return (
    <div className="query-selector">
      <label htmlFor="query-select" className="selector-label">
        Select a predefined query:
      </label>
      <select
        id="query-select"
        className="selector-dropdown"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {queries.map((query) => (
          <option key={query.id} value={query.id}>
            {query.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default QuerySelector

