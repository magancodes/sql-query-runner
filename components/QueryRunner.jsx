"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import QueryEditor from "./QueryEditor"
import ResultsTable from "./ResultsTable"
import QuerySelector from "./QuerySelector"
import QueryHistory from "./QueryHistory"
import { predefinedQueries } from "../lib/sample-queries"
import { generateMockData } from "../lib/mock-data"
import { AppContext } from "../App"
import "./QueryRunner.css"

function QueryRunner() {
  const navigate = useNavigate();
  const { setQueryData } = useContext(AppContext);
  
  const [currentQuery, setCurrentQuery] = useState(predefinedQueries[0].query);
  const [selectedQueryId, setSelectedQueryId] = useState(predefinedQueries[0].id);
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [history, setHistory] = useState([]);

  const hasResults = results.length > 0;

  useEffect(() => {
    executeQuery(currentQuery);
  }, []);

  const executeQuery = (query) => {
    setIsLoading(true);
    const startTime = performance.now();
    
    try {
      // Generate mock data based on the query
      const queryLower = query.toLowerCase();
      let mockData;
      
      if (queryLower.includes("users")) {
        mockData = generateMockData("users", 100);
      } else if (queryLower.includes("orders")) {
        mockData = generateMockData("orders", 100);
      } else if (queryLower.includes("products")) {
        mockData = generateMockData("products", 100);
      } else if (queryLower.includes("customers")) {
        mockData = generateMockData("customers", 100);
      } else {
        mockData = generateMockData("generic", 100);
      }
      
      setResults(mockData.data);
      setColumns(mockData.columns);
      
      // Update the context with the results
      setQueryData({
        data: mockData.data,
        columns: mockData.columns
      });
      
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now().toString(),
        query,
        timestamp: new Date()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Error executing query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelect = (id) => {
    const selected = predefinedQueries.find(q => q.id === id);
    if (selected) {
      setCurrentQuery(selected.query);
      setSelectedQueryId(id);
    }
  };

  const handleRunQuery = () => {
    executeQuery(currentQuery);
  };

  const handleHistorySelect = (query) => {
    setCurrentQuery(query);
    setActiveTab('editor');
  };

  const navigateToVisualize = () => {
    if (hasResults) {
      navigate('/visualize');
    }
  };

  return (
    <div className="query-runner">
      <div className="query-selector-container">
        <QuerySelector 
          queries={predefinedQueries} 
          selectedId={selectedQueryId} 
          onSelect={handleQuerySelect} 
        />
      </div>
      
      <div className="tabs">
        <div className="tab-list">
          <button 
            className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`} 
            onClick={() => setActiveTab('editor')}
          >
            Query Editor
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'editor' && (
            <div className="tab-panel">
              <QueryEditor 
                value={currentQuery} 
                onChange={setCurrentQuery} 
              />
              <div className="query-actions">
                <button 
                  className
              />
              <div className="query-actions">
                <button 
                  className="button primary-button" 
                  onClick={handleRunQuery} 
                  disabled={isLoading}
                >
                  <span className="icon">▶</span>
                  Run Query
                </button>
                
                <button 
                  className={`button success-button visualize-button ${!hasResults ? 'disabled' : ''}`}
                  onClick={navigateToVisualize}
                  disabled={!hasResults}
                >
                  <span className="icon">📊</span>
                  Visualize
                </button>
                
                {executionTime && (
                  <div className="execution-time">
                    <span className="icon">⏱</span>
                    Executed in {executionTime.toFixed(2)}ms
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-panel">
              <QueryHistory
                history={history}
                onSelect={handleHistorySelect}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="results-container">
        <h2>Results</h2>
        <ResultsTable 
          data={results} 
          columns={columns} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

export default QueryRunner;

