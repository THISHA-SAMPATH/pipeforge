// submit.js — Standalone Submit Button with Toast integration
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

export const SubmitButton = () => {
  const { nodes, edges, addToast } = useStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      addToast: state.addToast,
    }),
    shallow
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      
      // Success toast displaying parsed pipeline details
      addToast(
        `Pipeline analyzed: ${data.num_nodes} nodes, ${data.num_edges} edges. DAG: ${data.is_dag ? 'Yes (✓ Valid)' : 'No (✗ Cycles Found)'}`,
        data.is_dag ? 'success' : 'warning',
        5000
      );
    } catch (err) {
      // Friendly error toast (does not show raw "Network error" or traceback)
      addToast(
        'Could not connect to the analysis service. Please ensure the backend server is running.',
        'error',
        6000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    useStore.setState({ nodes: [], edges: [], nodeIDs: {} });
    localStorage.removeItem('pipeforge-state');
    addToast('Canvas cleared successfully.', 'info', 3000);
  };

  return (
    <div className="submit-container" style={{ display: 'flex', gap: '10px' }}>
      <button className="clear-pipeline-btn" onClick={handleClear} disabled={loading}>
        🧹 Clear Canvas
      </button>
      <button className="run-pipeline-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? '⏳ Analyzing...' : '▶ Run Pipeline'}
      </button>
    </div>
  );
};
