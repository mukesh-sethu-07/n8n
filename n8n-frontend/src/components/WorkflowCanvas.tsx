import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/stores/workflowStore';
import type { INode, IConnection } from '@/types';
import { CustomNode } from './CustomNode';
import { Button } from './ui/Button';
import { Play, Save } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

export const WorkflowCanvas: React.FC = () => {
  const {
    currentWorkflow,
    saveWorkflow,
    executeWorkflow,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    isSaving,
    isExecuting,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert workflow nodes to ReactFlow nodes
  useEffect(() => {
    if (!currentWorkflow) return;

    const reactFlowNodes: Node[] = currentWorkflow.nodes.map((node: INode) => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: {
        ...node,
        onDelete: () => deleteNode(node.id),
        onUpdate: (updates: Partial<INode>) => updateNode(node.id, updates),
      },
    }));

    const reactFlowEdges: Edge[] = currentWorkflow.connections.map((conn: IConnection) => ({
      id: `${conn.sourceNodeId}-${conn.targetNodeId}`,
      source: conn.sourceNodeId,
      target: conn.targetNodeId,
      sourceHandle: `output-${conn.sourceOutput}`,
      targetHandle: `input-${conn.targetInput}`,
    }));

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
  }, [currentWorkflow, setNodes, setEdges, deleteNode, updateNode]);

  // Handle node position changes
  const handleNodesChange = useCallback(
    (changes: unknown[]) => {
      onNodesChange(changes);

      // Update positions in store
      changes.forEach((change: any) => {
        if (change.type === 'position' && change.position) {
          updateNode(change.id, { position: change.position });
        }
      });
    },
    [onNodesChange, updateNode]
  );

  // Handle new connections
  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));

      if (connection.source && connection.target) {
        const newConnection: IConnection = {
          sourceNodeId: connection.source,
          sourceOutput: 0,
          targetNodeId: connection.target,
          targetInput: 0,
        };
        addConnection(newConnection);
      }
    },
    [setEdges, addConnection]
  );

  // Handle edge deletion
  const handleEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => {
        deleteConnection(edge.source, edge.target);
      });
    },
    [deleteConnection]
  );

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select or create a workflow to get started
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onEdgesDelete={handleEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        <Panel position="top-right" className="space-x-2">
          <Button
            onClick={saveWorkflow}
            disabled={isSaving}
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={executeWorkflow}
            disabled={isExecuting || !currentWorkflow.id}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? 'Executing...' : 'Execute'}
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
