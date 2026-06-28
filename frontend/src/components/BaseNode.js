// components/BaseNode.js
// ─────────────────────────────────────────────────────────────────────────────
// PipeForge — config-driven node abstraction
//
// HOW IT WORKS:
//   Every node passes a `config` object describing its title, fields,
//   inputs, and outputs. BaseNode renders the card, handles, and fields
//   from that config — zero copy-paste between nodes.
//
// CONFIG SHAPE:
//   {
//     title:   string            — displayed at top of card
//     color:   string            — accent color for the header (CSS var or hex)
//     icon:    string            — emoji icon shown next to title
//     fields:  FieldDef[]        — form fields rendered in the body
//     inputs:  HandleDef[]       — left-side connection handles
//     outputs: HandleDef[]       — right-side connection handles
//   }
//
// FIELD TYPES:
//   { key, label, type: 'text' | 'select' | 'textarea', options?, defaultValue? }
//
// HANDLE DEF:
//   { id, label }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ id, data, config }) => {

  // Initialize fields in the global store on mount
  useEffect(() => {
    const storeNode = useStore.getState().nodes.find(n => n.id === id);
    const storeData = storeNode?.data || {};
    (config.fields || []).forEach(f => {
      const currentVal = storeData[f.key];
      if (currentVal === undefined) {
        const defaultVal = data?.[f.key] ?? f.defaultValue ?? '';
        useStore.getState().updateNodeField(id, f.key, defaultVal);
      }
    });
  }, [id, data, config.fields]);

  // Distribute handles evenly along the node edge
  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    const step = 100 / (total + 1);
    return `${step * (index + 1)}%`;
  };

  const inputs  = config.inputs  || [];
  const outputs = config.outputs || [];

  const getFieldValue = (key, defaultValue) => {
    return data?.[key] ?? defaultValue ?? '';
  };

  // Sleek, compact height based on connections
  const minHeight = Math.max(48, Math.max(inputs.length, outputs.length) * 24 + 10);

  return (
    <div className="pf-node" style={{ '--node-color': config.color || 'var(--pf-purple)' }}>
      {/* ── Header ── */}
      <div className="pf-node-header">
        {config.icon && <span className="pf-node-icon">{config.icon}</span>}
        <span className="pf-node-title" style={{ maxWidth: 'calc(100% - 24px)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {config.title}
        </span>
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

      {/* ── Body ── */}
      <div className="pf-node-body" style={{ minHeight }}>

        {/* Input handles (left side) */}
        {inputs.map((handle, i) => (
          <Handle
            key={handle.id}
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            style={{ top: getHandleTop(i, inputs.length) }}
            className="pf-handle pf-handle-input"
            title={handle.label}
          />
        ))}

        {/* Handle labels (left side) — shown as tiny text near each handle */}
        {inputs.length > 1 && (
          <div className="pf-handle-labels pf-handle-labels-left">
            {inputs.map((h, i) => (
              <span key={h.id} className="pf-handle-label" style={{ top: getHandleTop(i, inputs.length) }}>
                {h.label}
              </span>
            ))}
          </div>
        )}

        {/* Dynamic form inputs inside node card */}
        <div className="pf-node-fields" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          {(config.fields || []).map((field) => (
            <div key={field.key} className="pf-field">
              <label className="pf-label">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  className="pf-select nodrag"
                  value={getFieldValue(field.key, field.defaultValue)}
                  onChange={(e) => useStore.getState().updateNodeField(id, field.key, e.target.value)}
                >
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  className="pf-textarea nodrag"
                  value={getFieldValue(field.key, field.defaultValue)}
                  onChange={(e) => useStore.getState().updateNodeField(id, field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                  rows={3}
                />
              ) : (
                <input
                  className="pf-input nodrag"
                  type={field.type || 'text'}
                  value={getFieldValue(field.key, field.defaultValue)}
                  onChange={(e) => useStore.getState().updateNodeField(id, field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                />
              )}
            </div>
          ))}
        </div>

        {/* Output handles (right side) */}
        {outputs.map((handle, i) => (
          <Handle
            key={handle.id}
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            style={{ top: getHandleTop(i, outputs.length) }}
            className="pf-handle pf-handle-output"
            title={handle.label}
          />
        ))}

        {/* Handle labels (right side) — shown as tiny text near each handle */}
        {outputs.length > 1 && (
          <div className="pf-handle-labels pf-handle-labels-right">
            {outputs.map((h, i) => (
              <span key={h.id} className="pf-handle-label pf-handle-label-right" style={{ top: getHandleTop(i, outputs.length) }}>
                {h.label}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
