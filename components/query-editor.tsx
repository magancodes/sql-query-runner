"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import "./query-editor.css"

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function QueryEditor({ value, onChange }: QueryEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([1])

  useEffect(() => {
    // Update line numbers when value changes
    const lines = (value.match(/\n/g) || []).length + 1
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key to insert spaces instead of changing focus
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd

      const newValue = value.substring(0, start) + "  " + value.substring(end)
      onChange(newValue)

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div className="query-editor">
      <div className="line-numbers">
        {lineNumbers.map((num) => (
          <div key={num} className="line-number">
            {num}
          </div>
        ))}
      </div>
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="editor-textarea"
        spellCheck={false}
        placeholder="Enter your SQL query here..."
      />
    </div>
  )
}

