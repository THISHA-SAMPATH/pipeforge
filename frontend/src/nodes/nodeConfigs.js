// nodes/nodeConfigs.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralized configuration definitions for all nodes.
// This allows both the canvas nodes and the Right Panel inspector to share the same fields definitions.
// ─────────────────────────────────────────────────────────────────────────────

export const NODE_CONFIGS = {
  customInput: {
    title: 'Input',
    icon: '📥',
    color: '#3b82f6', // blue
    fields: [
      { key: 'inputName', label: 'Name', type: 'text', defaultValue: 'input', placeholder: 'variable name' },
      { key: 'inputType', label: 'Type', type: 'select', defaultValue: 'Text', options: ['Text', 'File', 'Image'] },
    ],
    inputs: [],
    outputs: [{ id: 'value', label: 'Value' }],
  },
  customOutput: {
    title: 'Output',
    icon: '📤',
    color: '#8b5cf6', // purple
    fields: [
      { key: 'outputName', label: 'Name', type: 'text', defaultValue: 'output', placeholder: 'variable name' },
      { key: 'outputType', label: 'Type', type: 'select', defaultValue: 'Text', options: ['Text', 'Image', 'File'] },
    ],
    inputs: [{ id: 'value', label: 'Value' }],
    outputs: [],
  },
  llm: {
    title: 'LLM Agent',
    icon: '🤖',
    color: '#ef4444', // red/coral
    fields: [
      { key: 'model', label: 'Model', type: 'select', defaultValue: 'gpt-4o', options: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-5-sonnet', 'gemini-pro'] },
      { key: 'temperature', label: 'Temperature', type: 'text', defaultValue: '0.7', placeholder: '0.0 – 1.0' },
    ],
    inputs: [
      { id: 'system', label: 'System' },
      { id: 'prompt', label: 'Prompt' },
    ],
    outputs: [{ id: 'response', label: 'Response' }],
  },
  text: {
    title: 'Text',
    icon: '📝',
    color: '#f59e0b', // amber
    fields: [
      { key: 'text', label: 'Text', type: 'textarea', defaultValue: '{{input}}', placeholder: 'Type text or use {{variable}}' },
    ],
    inputs: [],
    outputs: [{ id: 'output', label: 'Output' }],
  },
  prompt: {
    title: 'Prompt Template',
    icon: '✍️',
    color: '#10b981', // green
    fields: [
      { key: 'template', label: 'Template', type: 'textarea', defaultValue: 'You are a helpful assistant. Answer: {{question}}', placeholder: 'Use {{variable}} for dynamic values' },
      { key: 'role', label: 'Role', type: 'select', defaultValue: 'user', options: ['user', 'system', 'assistant'] },
    ],
    inputs: [{ id: 'context', label: 'Context' }],
    outputs: [{ id: 'prompt', label: 'Prompt' }],
  },
  api: {
    title: 'API Call',
    icon: '🌐',
    color: '#06b6d4', // cyan/teal
    fields: [
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint' },
      { key: 'method', label: 'Method', type: 'select', defaultValue: 'GET', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
      { key: 'headers', label: 'Headers (JSON)', type: 'text', placeholder: '{"Authorization": "Bearer ..."}' },
    ],
    inputs: [{ id: 'body', label: 'Body' }],
    outputs: [{ id: 'response', label: 'Response' }, { id: 'status', label: 'Status' }],
  },
  condition: {
    title: 'Condition',
    icon: '🔀',
    color: '#ec4899', // pink
    fields: [
      { key: 'operator', label: 'Operator', type: 'select', defaultValue: 'contains', options: ['contains', 'equals', 'greater than', 'less than', 'starts with', 'ends with'] },
      { key: 'value', label: 'Compare value', type: 'text', placeholder: 'value to compare' },
    ],
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'true', label: 'True' }, { id: 'false', label: 'False' }],
  },
  filter: {
    title: 'Filter',
    icon: '🔽',
    color: '#f97316', // orange
    fields: [
      { key: 'mode', label: 'Mode', type: 'select', defaultValue: 'include', options: ['include', 'exclude', 'transform', 'truncate'] },
      { key: 'expression', label: 'Expression', type: 'text', placeholder: 'e.g. word count > 100' },
      { key: 'maxLength', label: 'Max length', type: 'text', placeholder: '500' },
    ],
    inputs: [{ id: 'data', label: 'Data' }],
    outputs: [{ id: 'result', label: 'Result' }],
  },
  note: {
    title: 'Note',
    icon: '🗒️',
    color: '#eab308', // yellow
    fields: [
      { key: 'content', label: 'Note', type: 'textarea', defaultValue: '', placeholder: 'Add a comment...' },
    ],
    inputs: [],
    outputs: [],
  },
};
