<template>
  <div class="query-runner">
    <div class="query-selector-container">
      <QuerySelector 
        :queries="predefinedQueries" 
        :selectedId="selectedQueryId" 
        @select="handleQuerySelect" 
      />
    </div>
    
    <div class="tabs">
      <div class="tab-list">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'editor' }" 
          @click="activeTab = 'editor'"
        >
          Query Editor
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'history' }" 
          @click="activeTab = 'history'"
        >
          History
        </button>
      </div>
      
      <div class="tab-content">
        <div v-if="activeTab === 'editor'" class="tab-panel">
          <QueryEditor 
            :value="currentQuery" 
            @update:value="setCurrentQuery" 
          />
          <div class="query-actions">
            <button 
              class="button primary-button" 
              @click="handleRunQuery" 
              :disabled="isLoading"
            >
              <span class="icon">▶</span>
              Run Query
            </button>
            
            <router-link 
              to="/visualize" 
              class="button success-button visualize-button"
              :class="{ disabled: !hasResults }"
              @click.prevent="navigateToVisualize"
            >
              <span class="icon">📊</span>
              Visualize
            </router-link>
            
            <div v-if="executionTime" class="execution-time">
              <span class="icon">⏱</span>
              Executed in {{ executionTime.toFixed(2) }}ms
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'history'" class="tab-panel">
          <QueryHistory 
            :history="history" 
            @select="handleHistorySelect" 
          />
        </div>
      </div>
    </div>
    
    <div class="results-container">
      <h2>Results</h2>
      <ResultsTable 
        :data="results" 
        :columns="columns" 
        :isLoading="isLoading" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import QueryEditor from './QueryEditor.vue';
import ResultsTable from './ResultsTable.vue';
import QuerySelector from './QuerySelector.vue';
import QueryHistory from './QueryHistory.vue';
import { predefinedQueries } from '../lib/sample-queries';
import { generateMockData } from '../lib/mock-data';
import { useDataStore } from '../stores/dataStore';

const router = useRouter();
const dataStore = useDataStore();

const currentQuery = ref(predefinedQueries[0].query);
const selectedQueryId = ref(predefinedQueries[0].id);
const results = ref([]);
const columns = ref([]);
const isLoading = ref(false);
const executionTime = ref(null);
const activeTab = ref('editor');
const history = ref([]);

const hasResults = computed(() => results.value.length > 0);

onMounted(() => {
  executeQuery(currentQuery.value);
});

const executeQuery = (query) => {
  isLoading.value = true;
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
    
    results.value = mockData.data;
    columns.value = mockData.columns;
    
    // Update the store with the results
    dataStore.setData(mockData.data);
    dataStore.setColumns(mockData.columns);
    
    const endTime = performance.now();
    executionTime.value = endTime - startTime;
    
    // Add to history
    const newHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date()
    };
    history.value = [newHistoryItem, ...history.value].slice(0, 10);
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleQuerySelect = (id) => {
  const selected = predefinedQueries.find(q => q.id === id);
  if (selected) {
    currentQuery.value = selected.query;
    selectedQueryId.value = id;
  }
};

const handleRunQuery = () => {
  executeQuery(currentQuery.value);
};

const setCurrentQuery = (value) => {
  currentQuery.value = value;
};

const handleHistorySelect = (query) => {
  currentQuery.value = query;
  activeTab.value = 'editor';
};

const navigateToVisualize = () => {
  if (hasResults.value) {
    router.push('/visualize');
  }
};
</script>

<style>
.query-runner {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
  overflow: hidden;
  margin-bottom: 2rem;
}

.query-selector-container {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.tabs {
  display: flex;
  flex-direction: column;
}

.tab-list {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--muted-color);
}

.tab-button {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.tab-button:hover:not(.active) {
  color: var(--foreground-color);
}

.tab-content {
  padding: 1rem;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.query-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.visualize-button {
  margin-left: 1rem;
}

.visualize-button.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.execution-time {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.results-container {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.results-container h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
</style>

