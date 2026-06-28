// nodes/nodeRegistry.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for ALL nodes in PipeForge.
// To add a new node: import it here, add to NODES array. That's it.
// ─────────────────────────────────────────────────────────────────────────────

import { InputNode }     from './inputNode';
import { OutputNode }    from './outputNode';
import { LLMNode }       from './llmNode';
import { TextNode }      from './textNode';
import { PromptNode }    from './promptNode';
import { ApiNode }       from './apiNode';
import { ConditionNode } from './conditionNode';
import { FilterNode }    from './filterNode';
import { NoteNode }      from './noteNode';

// ── Node metadata for toolbar + registration ──
export const NODES = [
  { type: 'customInput',  label: 'Input',            component: InputNode,     category: 'io'       },
  { type: 'customOutput', label: 'Output',           component: OutputNode,    category: 'io'       },
  { type: 'llm',          label: 'LLM',              component: LLMNode,       category: 'ai'       },
  { type: 'text',         label: 'Text',             component: TextNode,      category: 'data'     },
  { type: 'prompt',       label: 'Prompt Template',  component: PromptNode,    category: 'ai'       },
  { type: 'api',          label: 'API Call',         component: ApiNode,       category: 'data'     },
  { type: 'condition',    label: 'Condition',        component: ConditionNode, category: 'logic'    },
  { type: 'filter',       label: 'Filter',           component: FilterNode,    category: 'data'     },
  { type: 'note',         label: 'Note',             component: NoteNode,      category: 'utility'  },
];

// ── ReactFlow nodeTypes map — passed to <ReactFlow nodeTypes={nodeTypes} /> ──
export const nodeTypes = Object.fromEntries(
  NODES.map(n => [n.type, n.component])
);
