<template>
  <div class="results-table-container">
    <div v-if="!isLoading" class="table-actions">
      <div class="table-info">
        <span v-if="data.length > 0">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, data.length) }} of {{ data.length }} results
        </span>
      </div>
      <button 
        v-if="data.length > 0"
        class="button secondary-button" 
        @click="exportToCsv"
      >
        <span class="icon">📥</span>
        Export CSV
      </button>
    </div>
    
    <div v-if="isLoading" class="loading-skeleton">
      <div class="skeleton-header">
        <div v-for="i in 5" :key="`header-${i}`" class="skeleton-cell"></div>
      </div>
      <div v-for="row in 5" :key="`row-${row}`" class="skeleton-row">
        <div v-for="cell in 5" :key="`cell-${row}-${cell}`" class="skeleton-cell"></div>
      </div>
    </div>
    
    <div v-else-if="data.length === 0" class="no-results">
      No results to display. Run a query to see data.
    </div>
    
    <div v-else class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in currentPageData" :key="rowIndex" :class="{ 'alternate-row': rowIndex % 2 === 0 }">
            <td v-for="column in columns" :key="`${rowIndex}-${column}`">
              {{ row[column] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="button secondary-button" 
        @click="handlePreviousPage" 
        :disabled="currentPage === 1"
      >
        ← Previous
      </button>
      <div class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <button 
        class="button secondary-button" 
        @click="handleNextPage" 
        :disabled="currentPage === totalPages"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const currentPage = ref(1);
const rowsPerPage = 10;

const totalPages = computed(() => Math.ceil(props.data.length / rowsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * rowsPerPage);
const endIndex = computed(() => startIndex.value + rowsPerPage);
const currentPageData = computed(() => props.data.slice(startIndex.value, endIndex.value));

const handlePreviousPage = () => {
  currentPage.value = Math.max(currentPage.value - 1, 1);
};

const handleNextPage = () => {
  currentPage.value = Math.min(currentPage.value + 1, totalPages.value);
};

const exportToCsv = () => {
  if (props.data.length === 0) return;
  
  const csvContent = [
    props.columns.join(','),
    ...props.data.map(row => 
      props.columns.map(col => {
        const value = row[col];
        // Handle values with commas by wrapping in quotes
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `query_results_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style>
.results-table-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-info {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--table-border);
  border-radius: 4px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th {
  background-color: var(--table-header-background);
  text-align: left;
  padding: 0.75rem;
  font-weight: 600;
  border-bottom: 1px solid var(--table-border);
}

.results-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--table-border);
}

.results-table tr:last-child td {
  border-bottom: none;
}

.alternate-row {
  background-color: var(--table-row-alternate);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.page-info {
  font-size: 0.875rem;
}

.loading-skeleton {
  border: 1px solid var(--table-border);
  border-radius: 4px;
}

.skeleton-header {
  display: flex;
  padding: 0.75rem;
  background-color: var(--table-header-background);
  border-bottom: 1px solid var(--table-border);
}

.skeleton-row {
  display: flex;
  padding: 0.75rem;
  border-bottom: 1px solid var(--table-border);
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-cell {
  flex: 1;
  height: 1rem;
  background-color: var(--muted-color);
  border-radius: 4px;
  margin-right: 1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.6;
  }
}

.no-results {
  text-align: center;
  padding: 3rem 0;
  color: var(--muted-foreground);
}
</style>

