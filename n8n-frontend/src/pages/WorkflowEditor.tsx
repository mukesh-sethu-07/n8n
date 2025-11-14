import React, { useCallback } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { WorkflowList } from '@/components/WorkflowList';
import { NodePalette } from '@/components/NodePalette';

export const WorkflowEditor: React.FC = () => {
  const { addNode, currentWorkflow } = useWorkflowStore();

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType || !currentWorkflow) return;

      const canvasBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - canvasBounds.left - 75,
        y: event.clientY - canvasBounds.top - 20,
      };

      addNode(nodeType, position);
    },
    [addNode, currentWorkflow]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="h-full flex bg-background">
      {/* Left Sidebar - Workflows */}
      <aside className="w-64 border-r p-4 overflow-auto bg-card">
        <WorkflowList />
      </aside>

      {/* Center - Canvas */}
      <main
        className="flex-1 bg-gray-50 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {currentWorkflow && (
          <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md border">
            <p className="text-sm font-medium">{currentWorkflow.name}</p>
            <p className="text-xs text-muted-foreground">{currentWorkflow.nodes.length} nodes</p>
          </div>
        )}
        <WorkflowCanvas />
      </main>

      {/* Right Sidebar - Node Palette */}
      <aside className="w-64 border-l p-4 overflow-auto bg-card">
        <NodePalette />
      </aside>
    </div>
  );
};
