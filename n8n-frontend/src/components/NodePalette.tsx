import React, { useEffect } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { cn } from '@/lib/utils';

export const NodePalette: React.FC = () => {
  const { nodeTypes, loadNodeTypes, addNode } = useWorkflowStore();

  useEffect(() => {
    loadNodeTypes();
  }, [loadNodeTypes]);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getNodeColor = (type: string): string => {
    const colors: Record<string, string> = {
      Start: 'bg-green-100 text-green-800 border-green-300',
      HttpRequest: 'bg-blue-100 text-blue-800 border-blue-300',
      Set: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      Code: 'bg-orange-100 text-orange-800 border-orange-300',
      If: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Switch: 'bg-lime-100 text-lime-800 border-lime-300',
      Merge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle className="text-lg">Nodes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.name}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType.name)}
            className={cn(
              'px-3 py-2 rounded-lg border-2 cursor-move hover:shadow-md transition-shadow',
              getNodeColor(nodeType.name)
            )}
          >
            <div className="font-medium text-sm">{nodeType.displayName}</div>
            <div className="text-xs opacity-75 mt-1">{nodeType.description}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
