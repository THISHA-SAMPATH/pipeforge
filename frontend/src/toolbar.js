// toolbar.js — Modern Floating Node Palette
import { NODE_CONFIGS } from './nodes/nodeConfigs';

const DraggableNode = ({ type, label, icon, color }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="pf-draggable-node"
      draggable
      onDragStart={onDragStart}
      style={{ borderColor: color }}
    >
      <span className="draggable-node-icon" style={{ backgroundColor: color }}>
        {icon}
      </span>
      <span className="draggable-node-label">{label}</span>
    </div>
  );
};

export const NodePalette = () => {
  return (
    <div className="node-palette">
      <h4 className="node-palette-title">NODE PALETTE</h4>
      <div className="node-palette-list">
        {Object.entries(NODE_CONFIGS).map(([type, cfg]) => (
          <DraggableNode
            key={type}
            type={type}
            label={cfg.title}
            icon={cfg.icon}
            color={cfg.color}
          />
        ))}
      </div>
    </div>
  );
};
