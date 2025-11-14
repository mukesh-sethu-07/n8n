import { create } from 'zustand';
import type { IWorkflow, INode, IConnection, INodeTypeMetadata } from '../types';
import { workflowsApi, executionsApi, nodeTypesApi } from '../api/client';

interface WorkflowState {
  // Current workflow
  currentWorkflow: IWorkflow | null;
  workflows: IWorkflow[];
  nodeTypes: INodeTypeMetadata[];

  // Node selection and execution
  selectedNodeId: string | null;
  executionResults: Record<string, Array<{ json: Record<string, unknown> }>> | null;
  lastExecutionId: string | null;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isExecuting: boolean;

  // Actions
  loadWorkflows: () => Promise<void>;
  loadNodeTypes: () => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;
  createWorkflow: (name: string) => Promise<void>;
  saveWorkflow: () => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  executeWorkflow: () => Promise<void>;

  // Workflow editing
  setWorkflowName: (name: string) => void;
  addNode: (nodeType: string, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, updates: Partial<INode>) => void;
  deleteNode: (nodeId: string) => void;
  addConnection: (connection: IConnection) => void;
  deleteConnection: (sourceNodeId: string, targetNodeId: string) => void;

  // Node selection
  selectNode: (nodeId: string | null) => void;

  // Reset
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  currentWorkflow: null,
  workflows: [],
  nodeTypes: [],
  selectedNodeId: null,
  executionResults: null,
  lastExecutionId: null,
  isLoading: false,
  isSaving: false,
  isExecuting: false,

  loadWorkflows: async () => {
    set({ isLoading: true });
    try {
      const workflows = await workflowsApi.getAll();
      set({ workflows, isLoading: false });
    } catch (error) {
      console.error('Failed to load workflows:', error);
      set({ isLoading: false });
    }
  },

  loadNodeTypes: async () => {
    try {
      const nodeTypes = await nodeTypesApi.getAll();
      set({ nodeTypes });
    } catch (error) {
      console.error('Failed to load node types:', error);
    }
  },

  loadWorkflow: async (id: string) => {
    set({ isLoading: true });
    try {
      const workflow = await workflowsApi.getById(id);
      set({ currentWorkflow: workflow, isLoading: false });
    } catch (error) {
      console.error('Failed to load workflow:', error);
      set({ isLoading: false });
    }
  },

  createWorkflow: async (name: string) => {
    const newWorkflow: Omit<IWorkflow, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      active: false,
      nodes: [],
      connections: [],
    };

    try {
      const workflow = await workflowsApi.create(newWorkflow);
      set({ currentWorkflow: workflow });
      await get().loadWorkflows();
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  },

  saveWorkflow: async () => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    set({ isSaving: true });
    try {
      if (currentWorkflow.id) {
        await workflowsApi.update(currentWorkflow.id, currentWorkflow);
      } else {
        const saved = await workflowsApi.create(currentWorkflow);
        set({ currentWorkflow: saved });
      }
      await get().loadWorkflows();
      set({ isSaving: false });
    } catch (error) {
      console.error('Failed to save workflow:', error);
      set({ isSaving: false });
    }
  },

  deleteWorkflow: async (id: string) => {
    try {
      await workflowsApi.delete(id);
      await get().loadWorkflows();

      if (get().currentWorkflow?.id === id) {
        set({ currentWorkflow: null });
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  },

  executeWorkflow: async () => {
    const { currentWorkflow } = get();
    if (!currentWorkflow?.id) return;

    set({ isExecuting: true });
    try {
      const execution = await executionsApi.execute(currentWorkflow.id);
      set({
        isExecuting: false,
        executionResults: execution.data as Record<string, Array<{ json: Record<string, unknown> }>>,
        lastExecutionId: execution.id,
      });
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      set({ isExecuting: false });
    }
  },

  setWorkflowName: (name: string) => {
    const { currentWorkflow } = get();
    if (currentWorkflow) {
      set({ currentWorkflow: { ...currentWorkflow, name } });
    }
  },

  addNode: (nodeType: string, position: { x: number; y: number }) => {
    const { currentWorkflow, nodeTypes } = get();
    if (!currentWorkflow) return;

    const nodeTypeMetadata = nodeTypes.find((nt) => nt.name === nodeType);
    if (!nodeTypeMetadata) return;

    const newNode: INode = {
      id: `node_${Date.now()}`,
      name: nodeTypeMetadata.defaults.name,
      type: nodeType,
      position,
      parameters: {},
    };

    set({
      currentWorkflow: {
        ...currentWorkflow,
        nodes: [...currentWorkflow.nodes, newNode],
      },
    });
  },

  updateNode: (nodeId: string, updates: Partial<INode>) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    set({
      currentWorkflow: {
        ...currentWorkflow,
        nodes: currentWorkflow.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      },
    });
  },

  deleteNode: (nodeId: string) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    set({
      currentWorkflow: {
        ...currentWorkflow,
        nodes: currentWorkflow.nodes.filter((node) => node.id !== nodeId),
        connections: currentWorkflow.connections.filter(
          (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
        ),
      },
    });
  },

  addConnection: (connection: IConnection) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    set({
      currentWorkflow: {
        ...currentWorkflow,
        connections: [...currentWorkflow.connections, connection],
      },
    });
  },

  deleteConnection: (sourceNodeId: string, targetNodeId: string) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    set({
      currentWorkflow: {
        ...currentWorkflow,
        connections: currentWorkflow.connections.filter(
          (conn) => !(conn.sourceNodeId === sourceNodeId && conn.targetNodeId === targetNodeId)
        ),
      },
    });
  },

  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  resetWorkflow: () => {
    set({ currentWorkflow: null, selectedNodeId: null, executionResults: null });
  },
}));
