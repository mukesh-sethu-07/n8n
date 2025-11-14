import { create } from 'zustand';
import type { IWorkflowExecution } from '../types';
import { executionsApi } from '../api/client';

interface ExecutionState {
  executions: IWorkflowExecution[];
  selectedExecution: IWorkflowExecution | null;
  isLoading: boolean;
  filterStatus: 'all' | 'success' | 'error' | 'running';

  // Actions
  loadExecutions: (workflowId?: string) => Promise<void>;
  loadExecutionById: (id: string) => Promise<void>;
  setFilterStatus: (status: 'all' | 'success' | 'error' | 'running') => void;
  clearSelectedExecution: () => void;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  executions: [],
  selectedExecution: null,
  isLoading: false,
  filterStatus: 'all',

  loadExecutions: async (workflowId?: string) => {
    set({ isLoading: true });
    try {
      const executions = await executionsApi.getAll(workflowId);
      set({ executions, isLoading: false });
    } catch (error) {
      console.error('Failed to load executions:', error);
      set({ isLoading: false });
    }
  },

  loadExecutionById: async (id: string) => {
    set({ isLoading: true });
    try {
      const execution = await executionsApi.getById(id);
      set({ selectedExecution: execution, isLoading: false });
    } catch (error) {
      console.error('Failed to load execution:', error);
      set({ isLoading: false });
    }
  },

  setFilterStatus: (status) => {
    set({ filterStatus: status });
  },

  clearSelectedExecution: () => {
    set({ selectedExecution: null });
  },
}));
