// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

// Load saved state from localStorage if available
const loadSavedState = () => {
  try {
    const saved = localStorage.getItem('pipeforge-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        nodes: parsed.nodes || [],
        edges: parsed.edges || [],
        nodeIDs: parsed.nodeIDs || {},
      };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
  return { nodes: [], edges: [], nodeIDs: {} };
};

const savedState = loadSavedState();

export const useStore = create((set, get) => ({
    nodes: savedState.nodes,
    edges: savedState.edges,
    nodeIDs: savedState.nodeIDs,
    clearCanvas: () => {
      set({ nodes: [], edges: [], nodeIDs: {} });
      localStorage.removeItem('pipeforge-state');
    },
    toasts: [],
    logs: [
      { id: 'log-initial', text: 'System Initialized', status: 'success', time: '10:39:40 AM' }
    ],
    addLog: (log) => {
      set({ logs: [log, ...get().logs] });
    },
    addToast: (message, type = 'info', duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      set({ toasts: [...get().toasts, { id, message, type }] });
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    },
    removeToast: (id) => {
      set({ toasts: get().toasts.filter(t => t.id !== id) });
    },
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    deleteNode: (nodeId) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));

// Subscribe to store updates to automatically sync nodes, edges, and IDs to localStorage
useStore.subscribe((state) => {
  try {
    localStorage.setItem(
      'pipeforge-state',
      JSON.stringify({
        nodes: state.nodes,
        edges: state.edges,
        nodeIDs: state.nodeIDs,
      })
    );
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
});
