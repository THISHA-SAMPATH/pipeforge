// ui.js
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeTypes } from './nodes/nodeRegistry';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes, edges: state.edges,
  getNodeID: state.getNodeID, addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [menu, setMenu] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const appData = event?.dataTransfer?.getData('application/reactflow');
    if (!appData) return;
    const { nodeType: type } = JSON.parse(appData);
    if (!type) return;
    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
    const nodeID = getNodeID(type);
    addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
  }, [reactFlowInstance, getNodeID, addNode]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY - bounds.top,
        left: event.clientX - bounds.left,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const handleDuplicate = useCallback((nodeId) => {
    const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
    if (!nodeToDuplicate) return;

    const newId = getNodeID(nodeToDuplicate.type);
    const newPosition = {
      x: nodeToDuplicate.position.x + 40,
      y: nodeToDuplicate.position.y + 40,
    };

    const newData = { ...nodeToDuplicate.data, id: newId };

    addNode({
      ...nodeToDuplicate,
      id: newId,
      position: newPosition,
      data: newData,
    });
    setMenu(null);
  }, [nodes, getNodeID, addNode]);

  const handleDelete = useCallback((nodeId) => {
    useStore.getState().deleteNode(nodeId);
    setMenu(null);
  }, []);

  return (
    <div ref={reactFlowWrapper} className="pf-canvas" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect} onDrop={onDrop} onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid={true}
        connectionLineType="smoothstep"
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onMoveStart={onPaneClick}
      >
        <Background color="#2a2a3a" gap={gridSize} size={1} />
        <Controls />
        <MiniMap
          nodeColor={() => '#2a2a3a'}
          maskColor="rgba(0,0,0,0.4)"
        />
      </ReactFlow>

      {menu && (
        <div
          className="pf-context-menu"
          style={{ top: menu.top, left: menu.left }}
          onContextMenu={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="pf-context-menu-item" onClick={() => handleDuplicate(menu.id)}>
            📋 Duplicate Node
          </button>
          <button className="pf-context-menu-item delete" onClick={() => handleDelete(menu.id)}>
            🗑️ Delete Node
          </button>
        </div>
      )}
    </div>
  );
};
