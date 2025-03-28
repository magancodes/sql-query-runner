<template>
  <div class="query-editor">
    <div class="line-numbers">
      <div v-for="num in lineNumbers" :key="num" class="line-number">{{ num }}</div>
    </div>
    <textarea
      ref="editorRef"
      :value="value"
      @input="handleInput"
      @keydown="handleKeyDown"
      class="editor-textarea"
      spellcheck="false"
      placeholder="Enter your SQL query here..."
    ></textarea>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:value']);

const editorRef = ref(null);

const lineNumbers = computed(() => {
  const lines = (props.value.match(/\n/g) || []).length + 1;
  return Array.from({ length: lines }, (_, i) => i + 1);
});

const handleInput = (e) => {
  emit('update:value', e.target.value);
};

const handleKeyDown = (e) => {
  // Handle tab key to insert spaces instead of changing focus
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    
    const newValue = props.value.substring(0, start) + '  ' + props.value.substring(end);
    emit('update:value', newValue);
    
    // Set cursor position after the inserted tab
    setTimeout(() => {
      if (editorRef.value) {
        editorRef.value.selectionStart = editorRef.value.selectionEnd = start + 2;
      }
    }, 0);
  }
};
</script>

<style>
.query-editor {
  display: flex;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--code-background);
}

.line-numbers {
  background-color: var(--muted-color);
  padding: 0.5rem 0;
  text-align: right;
  border-right: 1px solid var(--border-color);
  user-select: none;
}

.line-number {
  padding: 0 0.5rem;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

.editor-textarea {
  flex: 1;
  padding: 0.5rem;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  border: none;
  outline: none;
  resize: none;
  min-height: 200px;
  background-color: var(--code-background);
  color: var(--foreground-color);
}

.editor-textarea::placeholder {
  color: var(--muted-foreground);
}
</style>

