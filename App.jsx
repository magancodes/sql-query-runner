"use client"

import { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import QueryRunnerPage from "./pages/QueryRunnerPage"
import VisualizationPage from "./pages/VisualizationPage"
import "./App.css"

// Create context for dark mode and data sharing
export const AppContext = createContext()

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [queryData, setQueryData] = useState({
    data: [],
    columns: [],
  })

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode
      localStorage.setItem("dark-mode", newMode ? "true" : "false")
      return newMode
    })
  }

  // Check for saved theme preference or prefer-color-scheme
  useEffect(() => {
    const savedTheme = localStorage.getItem("dark-mode")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "true")
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  return (
    <AppContext.Provider value={{ isDarkMode, toggleDarkMode, queryData, setQueryData }}>
      <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
        <header className="header">
          <div className="container">
            <h1>SQL Query Runner</h1>
            <p>Run SQL queries and visualize results instantly</p>
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>
        <main className="container">
          <Router>
            <Routes>
              <Route path="/" element={<QueryRunnerPage />} />
              <Route path="/visualize" element={<VisualizationPage />} />
            </Routes>
          </Router>
        </main>
      </div>
    </AppContext.Provider>
  )
}

export default App

