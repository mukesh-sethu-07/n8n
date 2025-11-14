// Core Types for Frontend (matching backend)

export interface INode {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  parameters: Record<string, unknown>;
}

export interface IConnection {
  sourceNodeId: string;
  sourceOutput: number;
  targetNodeId: string;
  targetInput: number;
}

export interface IWorkflow {
  id?: string;
  name: string;
  active: boolean;
  nodes: INode[];
  connections: IConnection[];
  settings?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface INodeProperty {
  displayName: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'options' | 'collection' | 'json';
  default: unknown;
  required?: boolean;
  description?: string;
  options?: Array<{ name: string; value: string | number }>;
  placeholder?: string;
}

export interface INodeTypeMetadata {
  name: string;
  displayName: string;
  description: string;
  group: string[];
  version: number;
  defaults: {
    name: string;
    color: string;
  };
  inputs: string[];
  outputs: string[];
  properties: INodeProperty[];
}

export interface IWorkflowExecution {
  id?: string;
  workflowId: string;
  status: 'running' | 'success' | 'error';
  startedAt: string;
  finishedAt?: string;
  data?: Record<string, unknown>;
  error?: string;
}
