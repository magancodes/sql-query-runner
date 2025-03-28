"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Download, BarChart, LineChart, PieChart, ScatterChart } from "lucide-react"
import Chart from "chart.js/auto"
import { useQueryStore } from "@/lib/store"
import "./visualization-dashboard.css"

export default function VisualizationDashboard() {
  const { data, columns } = useQueryStore()
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const chartCanvas = useRef<HTMLCanvasElement>(null)
  const [chartInstance, setChartInstance] = useState<Chart | null>(null)

  // Chart configuration
  const [selectedChartType, setSelectedChartType] = useState("bar")
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [valueField, setValueField] = useState("")
  const [chartTitle, setChartTitle] = useState("Data Visualization")
  const [showLegend, setShowLegend] = useState(true)
  const [showGridLines, setShowGridLines] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [chartTypeDropdown, setChartTypeDropdown] = useState(false)
  const [xAxisDropdown, setXAxisDropdown] = useState(false)
  const [yAxisDropdown, setYAxisDropdown] = useState(false)
  const [valueFieldDropdown, setValueFieldDropdown] = useState(false)

  // Get numeric columns for chart data
  const numericColumns =
    data.length > 0
      ? columns.filter((column) => {
          const sampleValue = data[0][column]
          return typeof sampleValue === "number" || !isNaN(Number.parseFloat(sampleValue))
        })
      : []

  // Set default axes when data is available
  useEffect(() => {
    if (columns.length > 0 && !xAxis) {
      setXAxis(columns[0])

      if (numericColumns.length > 0) {
        setYAxis(numericColumns[0])
        setValueField(numericColumns[0])
      }
    }
  }, [columns, numericColumns, xAxis])

  // Initialize chart when component is mounted
  useEffect(() => {
    if (data.length > 0) {
      initChart()
    }

    // Cleanup chart instance on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    }
  }, [])

  // Update chart when theme changes
  useEffect(() => {
    if (chartInstance) {
      updateChartTheme()
      chartInstance.update()
    }
  }, [isDarkMode])

  // Apply changes to the chart
  const applyChanges = () => {
    if (chartInstance) {
      chartInstance.destroy()
    }
    initChart()
  }

  // Initialize or update the chart
  const initChart = () => {
    if (!chartCanvas.current || data.length === 0) return

    const ctx = chartCanvas.current.getContext("2d")
    if (!ctx) return

    // Prepare data based on chart type
    const chartData = prepareChartData()

    // Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          labels: {
            color: isDarkMode ? "#f8fafc" : "#333333",
          },
        },
        title: {
          display: !!chartTitle,
          text: chartTitle,
          color: isDarkMode ? "#f8fafc" : "#333333",
          font: {
            size: 16,
          },
        },
      },
      animation: animations,
      scales: ["bar", "line", "scatter"].includes(selectedChartType)
        ? {
            x: {
              grid: {
                display: showGridLines,
                color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: isDarkMode ? "#f8fafc" : "#333333",
              },
            },
            y: {
              grid: {
                display: showGridLines,
                color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: isDarkMode ? "#f8fafc" : "#333333",
              },
            },
          }
        : undefined,
    }

    // Create chart
    const newChartInstance = new Chart(ctx, {
      type: selectedChartType as any,
      data: chartData,
      options: options as any,
    })

    setChartInstance(newChartInstance)
  }

  // Update chart theme based on dark mode
  const updateChartTheme = () => {
    if (!chartInstance) return

    // Update title color
    if (chartInstance.options.plugins?.title) {
      chartInstance.options.plugins.title.color = isDarkMode ? "#f8fafc" : "#333333"
    }

    // Update legend colors
    if (chartInstance.options.plugins?.legend) {
      if (chartInstance.options.plugins.legend.labels) {
        chartInstance.options.plugins.legend.labels.color = isDarkMode ? "#f8fafc" : "#333333"
      }
    }

    // Update scales if they exist
    if (chartInstance.options.scales) {
      for (const scale in chartInstance.options.scales) {
        const scaleObj = chartInstance.options.scales[scale as keyof typeof chartInstance.options.scales]
        if (scaleObj && "grid" in scaleObj) {
          scaleObj.grid.color = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        }
        if (scaleObj && "ticks" in scaleObj) {
          scaleObj.ticks.color = isDarkMode ? "#f8fafc" : "#333333"
        }
      }
    }
  }

  // Prepare data for the chart based on selected type
  const prepareChartData = () => {
    const chartData = {
      labels: [],
      datasets: [],
    }

    if (!xAxis || data.length === 0) return chartData

    // Extract labels from x-axis
    chartData.labels = data.map((item) => item[xAxis])

    // Prepare dataset based on chart type
    if (["bar", "line", "scatter"].includes(selectedChartType)) {
      if (!yAxis) return chartData

      chartData.datasets.push({
        label: yAxis,
        data: data.map((item) => Number.parseFloat(item[yAxis])),
        backgroundColor: getRandomColors(1)[0],
        borderColor: selectedChartType === "line" ? getRandomColors(1)[0] : undefined,
        fill: selectedChartType === "line" ? false : undefined,
        tension: selectedChartType === "line" ? 0.4 : undefined,
      })
    } else if (["pie", "doughnut", "radar"].includes(selectedChartType)) {
      if (!valueField) return chartData

      chartData.datasets.push({
        label: valueField,
        data: data.map((item) => Number.parseFloat(item[valueField])),
        backgroundColor: getRandomColors(chartData.labels.length),
        borderColor: isDarkMode ? "#0f172a" : "#ffffff",
        borderWidth: 1,
      })
    }

    return chartData
  }

  // Generate random colors for chart
  const getRandomColors = (count: number) => {
    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#6366f1",
    ]

    if (count <= colors.length) {
      return colors.slice(0, count)
    }

    // If we need more colors than in our predefined list
    const result = [...colors]
    for (let i = colors.length; i < count; i++) {
      const r = Math.floor(Math.random() * 255)
      const g = Math.floor(Math.random() * 255)
      const b = Math.floor(Math.random() * 255)
      result.push(`rgb(${r}, ${g}, ${b})`)
    }

    return result
  }

  // Download chart as image
  const downloadChart = () => {
    if (!chartCanvas.current) return

    const link = document.createElement("a")
    link.download = `${chartTitle || "chart"}.png`
    link.href = chartCanvas.current.toDataURL("image/png")
    link.click()
  }

  const chartTypes = [
    { value: "bar", label: "Bar Chart", icon: <BarChart className="dropdown-icon" /> },
    { value: "line", label: "Line Chart", icon: <LineChart className="dropdown-icon" /> },
    { value: "pie", label: "Pie Chart", icon: <PieChart className="dropdown-icon" /> },
    { value: "scatter", label: "Scatter Plot", icon: <ScatterChart className="dropdown-icon" /> },
    { value: "doughnut", label: "Doughnut Chart", icon: <PieChart className="dropdown-icon" /> },
    { value: "radar", label: "Radar Chart", icon: <BarChart className="dropdown-icon" /> },
  ]

  return (
    <div className="visualization-dashboard">
      <div className="dashboard-sidebar">
        <h3 className="sidebar-title">Chart Options</h3>

        <div className="options-container">
          <div className="option-group">
            <label htmlFor="chart-type">Chart Type</label>
            <div className="custom-dropdown">
              <button className="dropdown-button" onClick={() => setChartTypeDropdown(!chartTypeDropdown)}>
                {chartTypes.find((t) => t.value === selectedChartType)?.label || "Select chart type"}
                <span className="dropdown-arrow">▼</span>
              </button>
              {chartTypeDropdown && (
                <ul className="dropdown-menu">
                  {chartTypes.map((type) => (
                    <li
                      key={type.value}
                      className={`dropdown-item ${selectedChartType === type.value ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedChartType(type.value)
                        setChartTypeDropdown(false)
                      }}
                    >
                      {type.icon}
                      {type.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="option-section">
            <h4 className="section-title">Data Configuration</h4>

            {columns.length > 0 && (
              <div className="option-group">
                <label htmlFor="x-axis">X-Axis</label>
                <div className="custom-dropdown">
                  <button className="dropdown-button" onClick={() => setXAxisDropdown(!xAxisDropdown)}>
                    {xAxis || "Select X-Axis"}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {xAxisDropdown && (
                    <ul className="dropdown-menu">
                      {columns.map((column) => (
                        <li
                          key={column}
                          className={`dropdown-item ${xAxis === column ? "selected" : ""}`}
                          onClick={() => {
                            setXAxis(column)
                            setXAxisDropdown(false)
                          }}
                        >
                          {column}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {columns.length > 0 && ["bar", "line", "scatter"].includes(selectedChartType) && (
              <div className="option-group">
                <label htmlFor="y-axis">Y-Axis</label>
                <div className="custom-dropdown">
                  <button className="dropdown-button" onClick={() => setYAxisDropdown(!yAxisDropdown)}>
                    {yAxis || "Select Y-Axis"}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {yAxisDropdown && (
                    <ul className="dropdown-menu">
                      {numericColumns.map((column) => (
                        <li
                          key={column}
                          className={`dropdown-item ${yAxis === column ? "selected" : ""}`}
                          onClick={() => {
                            setYAxis(column)
                            setYAxisDropdown(false)
                          }}
                        >
                          {column}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {["pie", "doughnut"].includes(selectedChartType) && columns.length > 0 && (
              <div className="option-group">
                <label htmlFor="value-field">Value Field</label>
                <div className="custom-dropdown">
                  <button className="dropdown-button" onClick={() => setValueFieldDropdown(!valueFieldDropdown)}>
                    {valueField || "Select Value Field"}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {valueFieldDropdown && (
                    <ul className="dropdown-menu">
                      {numericColumns.map((column) => (
                        <li
                          key={column}
                          className={`dropdown-item ${valueField === column ? "selected" : ""}`}
                          onClick={() => {
                            setValueField(column)
                            setValueFieldDropdown(false)
                          }}
                        >
                          {column}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="option-group">
              <label htmlFor="chart-title">Chart Title</label>
              <input
                id="chart-title"
                className="text-input"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title"
              />
            </div>

            <div className="option-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="show-legend"
                  checked={showLegend}
                  onChange={(e) => setShowLegend(e.target.checked)}
                />
                <label htmlFor="show-legend">Show Legend</label>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="show-grid"
                  checked={showGridLines}
                  onChange={(e) => setShowGridLines(e.target.checked)}
                />
                <label htmlFor="show-grid">Show Grid Lines</label>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="animations"
                  checked={animations}
                  onChange={(e) => setAnimations(e.target.checked)}
                />
                <label htmlFor="animations">Enable Animations</label>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="button button-primary" onClick={applyChanges}>
              <BarChart className="icon" />
              Apply Changes
            </button>
            <button className="button button-outline" onClick={downloadChart}>
              <Download className="icon" />
              Download Chart
            </button>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <canvas ref={chartCanvas}></canvas>
        </div>
      </div>
    </div>
  )
}

