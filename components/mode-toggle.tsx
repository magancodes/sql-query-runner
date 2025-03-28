"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import "./mode-toggle.css"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    closeDropdown()
  }

  return (
    <div className="theme-dropdown">
      <button className="theme-toggle-button" onClick={toggleDropdown} aria-label="Toggle theme">
        <Sun className="sun-icon" />
        <Moon className="moon-icon" />
      </button>
      {isOpen && (
        <div className="theme-dropdown-content">
          <button
            className={`theme-option ${theme === "light" ? "active" : ""}`}
            onClick={() => handleThemeChange("light")}
          >
            Light
          </button>
          <button
            className={`theme-option ${theme === "dark" ? "active" : ""}`}
            onClick={() => handleThemeChange("dark")}
          >
            Dark
          </button>
          <button
            className={`theme-option ${theme === "system" ? "active" : ""}`}
            onClick={() => handleThemeChange("system")}
          >
            System
          </button>
        </div>
      )}
    </div>
  )
}

