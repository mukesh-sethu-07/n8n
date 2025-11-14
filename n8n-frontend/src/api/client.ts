import axios from 'axios';
import type { IWorkflow, IWorkflowExecution, INodeTypeMetadata } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Workflows API
export const workflowsApi = {
  getAll: async (): Promise<IWorkflow[]> => {
    const response = await apiClient.get('/workflows');
    return response.data;
  },

  getById: async (id: string): Promise<IWorkflow> => {
    const response = await apiClient.get(`/workflows/${id}`);
    return response.data;
  },

  create: async (workflow: Omit<IWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<IWorkflow> => {
    const response = await apiClient.post('/workflows', workflow);
    return response.data;
  },

  update: async (id: string, workflow: Partial<IWorkflow>): Promise<IWorkflow> => {
    const response = await apiClient.put(`/workflows/${id}`, workflow);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workflows/${id}`);
  },

  activate: async (id: string): Promise<IWorkflow> => {
    const response = await apiClient.post(`/workflows/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: string): Promise<IWorkflow> => {
    const response = await apiClient.post(`/workflows/${id}/deactivate`);
    return response.data;
  },
};

// Executions API
export const executionsApi = {
  getAll: async (workflowId?: string): Promise<IWorkflowExecution[]> => {
    const response = await apiClient.get('/executions', {
      params: workflowId ? { workflowId } : {},
    });
    return response.data;
  },

  getById: async (id: string): Promise<IWorkflowExecution> => {
    const response = await apiClient.get(`/executions/${id}`);
    return response.data;
  },

  execute: async (workflowId: string): Promise<IWorkflowExecution> => {
    const response = await apiClient.post(`/executions/execute/${workflowId}`);
    return response.data;
  },
};

// Node Types API
export const nodeTypesApi = {
  getAll: async (): Promise<INodeTypeMetadata[]> => {
    const response = await apiClient.get('/node-types');
    return response.data;
  },

  getByName: async (name: string): Promise<INodeTypeMetadata> => {
    const response = await apiClient.get(`/node-types/${name}`);
    return response.data;
  },
};
