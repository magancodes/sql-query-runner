"use client"

import { useState } from "react"
import "./query-selector.css"

interface Query {
  id: string
  name: string
  query: string
}

interface QuerySelectorProps {
  queries: Query[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function QuerySelector({ queries, selectedId, onSelect }: QuerySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (id: string) => {
    onSelect(id)
    setIsOpen(false)
  }

  const selectedQuery = queries.find((q) => q.id === selectedId)

  return (
    <div className="query-selector">
      <label htmlFor="query-select" className="selector-label">
        Select a predefined query:
      </label>
      <div className="custom-select">
        <button
          className="select-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedQuery?.name || "Select a query"}
          <span className="select-arrow">▼</span>
        </button>
        {isOpen && (
          <ul className="select-dropdown" role="listbox">
            {queries.map((query) => (
              <li
                key={query.id}
                className={`select-option ${query.id === selectedId ? "selected" : ""}`}
                onClick={() => handleSelect(query.id)}
                role="option"
                aria-selected={query.id === selectedId}
              >
                {query.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

