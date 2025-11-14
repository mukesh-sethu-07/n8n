// Core Types for Workflow Automation

export interface INodeType {
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
  execute: (context: INodeExecutionContext) => Promise<INodeExecutionData[][]>;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INodeExecutionData {
  json: Record<string, unknown>;
  binary?: Record<string, IBinaryData>;
}

export interface IBinaryData {
  data: string;
  mimeType: string;
  fileName?: string;
}

export interface INodeExecutionContext {
  node: INode;
  inputData: INodeExecutionData[][];
  workflow: IWorkflow;
  getNodeParameter: (parameterName: string, defaultValue?: unknown) => unknown;
  helpers: {
    httpRequest: (options: IHttpRequestOptions) => Promise<unknown>;
  };
}

export interface IHttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  json?: boolean;
}

export interface IWorkflowExecution {
  id?: string;
  workflowId: string;
  status: 'running' | 'success' | 'error';
  startedAt: Date;
  finishedAt?: Date;
  data?: Record<string, unknown>;
  error?: string;
}

export interface ICredentials {
  id?: string;
  name: string;
  type: string;
  data: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
