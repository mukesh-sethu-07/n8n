import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Plus, Trash2, FileText } from 'lucide-react';

export const WorkflowList: React.FC = () => {
  const { workflows, loadWorkflows, createWorkflow, deleteWorkflow, loadWorkflow } =
    useWorkflowStore();
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [showNewWorkflowInput, setShowNewWorkflowInput] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) return;

    await createWorkflow(newWorkflowName);
    setNewWorkflowName('');
    setShowNewWorkflowInput(false);
  };

  const handleDeleteWorkflow = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this workflow?')) {
      await deleteWorkflow(id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Workflows</CardTitle>
        <Button
          size="sm"
          onClick={() => setShowNewWorkflowInput(!showNewWorkflowInput)}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-2">
        {showNewWorkflowInput && (
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Workflow name"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkflow()}
              autoFocus
            />
            <Button size="sm" onClick={handleCreateWorkflow}>
              Create
            </Button>
          </div>
        )}

        {workflows.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No workflows yet</p>
            <p className="text-sm">Create your first workflow to get started</p>
          </div>
        ) : (
          workflows.map((workflow) => (
            <div
              key={workflow.id}
              onClick={() => workflow.id && loadWorkflow(workflow.id)}
              className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors flex items-center justify-between group"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{workflow.name}</div>
                <div className="text-xs text-muted-foreground">
                  {workflow.nodes.length} nodes
                  {workflow.active && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                      Active
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => workflow.id && handleDeleteWorkflow(workflow.id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
