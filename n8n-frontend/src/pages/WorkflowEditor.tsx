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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 bg-card">
        <h1 className="text-2xl font-bold">n8n Workflow Automation</h1>
        {currentWorkflow && (
          <p className="text-sm text-muted-foreground mt-1">Editing: {currentWorkflow.name}</p>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Workflows */}
        <aside className="w-64 border-r p-4 overflow-auto bg-card">
          <WorkflowList />
        </aside>

        {/* Center - Canvas */}
        <main
          className="flex-1 bg-gray-50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <WorkflowCanvas />
        </main>

        {/* Right Sidebar - Node Palette */}
        <aside className="w-64 border-l p-4 overflow-auto bg-card">
          <NodePalette />
        </aside>
      </div>
    </div>
  );
};
