// nodes/textNode.js
// ─────────────────────────────────────────────────────────────────────────────
// Special node — extends BaseNode concept but handles its own render
// because it has two dynamic behaviours:
//   1. Auto-resize: width/height grow as user types
//   2. Dynamic handles: {{variableName}} → new input handle appears
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

// Regex to extract {{variableName}} — matches valid JS identifiers inside {{ }} with optional surrounding whitespace
const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const [text, setText]       = useState(data?.text || '{{input}}');
  const [variables, setVars]  = useState([]);
  const [nodeSize, setSize]   = useState({ width: 220, height: 110 });
  const textareaRef           = useRef(null);
  const mirrorRef             = useRef(null);
  const updateNodeInternals   = useUpdateNodeInternals();

  // Initialize text in the global store on mount
  useEffect(() => {
    const storeNode = useStore.getState().nodes.find(n => n.id === id);
    const storeData = storeNode?.data || {};
    if (storeData.text === undefined) {
      useStore.getState().updateNodeField(id, 'text', text);
    }
  }, [id, text]);

  // Synchronize local state with store changes
  useEffect(() => {
    if (data?.text !== undefined && data.text !== text) {
      setText(data.text);
    }
  }, [data?.text, text]);

  // Update node internals when variables list changes to re-measure handles
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  // ── Parse {{variables}} from text whenever text changes ──
  useEffect(() => {
    const found = [];
    const seen  = new Set();
    let match;
    VAR_REGEX.lastIndex = 0; // reset regex state
    while ((match = VAR_REGEX.exec(text)) !== null) {
      const name = match[1];
      if (!seen.has(name)) {
        seen.add(name);
        found.push(name);
      }
    }
    setVars(found);
  }, [text]);

  // ── Auto-resize: measure text using a hidden mirror div ──
  useEffect(() => {
    if (!mirrorRef.current) return;
    mirrorRef.current.textContent = text || ' ';
    const scrollH = mirrorRef.current.scrollHeight;
    const scrollW = mirrorRef.current.scrollWidth;
    setSize({
      width:  Math.max(220, Math.min(scrollW + 48, 480)),
      height: Math.max(80, scrollH + 70), // offset for header + padding + label
    });
  }, [text]);

  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    const step = 100 / (total + 1);
    return `${step * (index + 1)}%`;
  };

  return (
    <div
      className="pf-node"
      style={{
        '--node-color': '#f59e0b', // Amber theme
        width:  nodeSize.width,
        minHeight: nodeSize.height,
      }}
    >
      {/* Header */}
      <div className="pf-node-header">
        <span className="pf-node-icon">📝</span>
        <span className="pf-node-title" style={{ maxWidth: 'calc(100% - 24px)', overflow: 'hidden', textOverflow: 'ellipsis' }}>Text</span>
        <button
          className="pf-node-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            useStore.getState().deleteNode(id);
          }}
          title="Delete Node"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="pf-node-body" style={{ minHeight: nodeSize.height - 40 }}>

        {/* Dynamic input handles — one per {{variable}} */}
        {variables.map((varName, i) => (
          <Handle
            key={varName}
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{ top: getHandleTop(i, variables.length) }}
            className="pf-handle pf-handle-input"
            title={varName}
          />
        ))}

        {/* Variable handle labels */}
        {variables.map((varName, i) => (
          <span
            key={varName}
            className="pf-var-label"
            style={{ top: getHandleTop(i, variables.length) }}
          >
            {varName}
          </span>
        ))}

        {/* Edit field directly on card */}
        <div className="pf-field" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <label className="pf-label">Text</label>
          <textarea
            ref={textareaRef}
            className="pf-textarea nodrag"
            value={text}
            onChange={(e) => {
              const val = e.target.value;
              setText(val);
              useStore.getState().updateNodeField(id, 'text', val);
            }}
            placeholder="Type text or use {{variable}}"
            style={{ width: '100%', resize: 'none', minHeight: '50px' }}
          />
        </div>

        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-output`}
          style={{ top: '50%' }}
          className="pf-handle pf-handle-output"
          title="Output"
        />
      </div>

      {/* Hidden mirror div for measuring text size */}
      <div
        ref={mirrorRef}
        style={{
          position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          fontSize: '11px', lineHeight: '1.5',
          padding: '6px 8px',
          width: Math.max(174, nodeSize.width - 46),
          top: 0, left: 0,
        }}
      />
    </div>
  );
};
