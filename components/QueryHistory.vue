<template>
  <div class="query-history">
    <div v-if="history.length === 0" class="no-history">
      No query history yet. Run some queries to see them here.
    </div>
    
    <div v-else class="history-list">
      <div 
        v-for="item in history" 
        :key="item.id" 
        class="history-item"
      >
        <div class="history-item-header">
          <div class="history-timestamp">
            {{ formatTime(item.timestamp) }}
          </div>
          <button 
            class="button secondary-button small-button" 
            @click="() => $emit('select', item.query)"
          >
            Use
          </button>
        </div>
        <pre class="history-query">{{ truncateQuery(item.query) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  history: {
    type: Array,
    required: true
  }
});

defineEmits(['select']);

const formatTime = (date) => {
  // Simple relative time formatting
  const now = new Date();
  const diff = now - new Date(date);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

const truncateQuery = (query) => {
  return query.length > 150 ? `${query.substring(0, 150)}...` : query;
};
</script>

<style>
.query-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-history {
  text-align: center;
  padding: 3rem 0;
  color: var(--muted-foreground);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.75rem;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: var(--muted-color);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-timestamp {
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.small-button {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  height: 1.5rem;
}

.history-query {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
  background-color: var(--code-background);
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

