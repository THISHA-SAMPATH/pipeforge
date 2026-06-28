import './styles/index.css';
import { PipelineUI }   from './ui';
import { NodePalette }  from './toolbar';
import { SubmitButton } from './submit';
import { useStore }     from './store';
import { shallow }      from 'zustand/shallow';

const ToastContainer = () => {
  const { toasts, removeToast } = useStore(
    (state) => ({ toasts: state.toasts, removeToast: state.removeToast }),
    shallow
  );

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✗'}
            {toast.type === 'warning' && '⚠'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

function App() {
  return (
    <div className="app-container" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Floating 9-node Toolbar Palette */}
      <NodePalette />
      
      {/* ReactFlow Canvas */}
      <div className="canvas-container-wrapper" style={{ width: '100%', height: '100%' }}>
        <PipelineUI />
      </div>
      
      {/* Floating Submit Action */}
      <SubmitButton />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
