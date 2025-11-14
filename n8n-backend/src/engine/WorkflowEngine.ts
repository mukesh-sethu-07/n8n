import type {
  IWorkflow,
  INode,
  IConnection,
  INodeExecutionData,
  INodeExecutionContext,
  INodeType,
} from '../types';
import { NodeRegistry } from './NodeRegistry';

export class WorkflowEngine {
  private nodeRegistry: NodeRegistry;

  constructor() {
    this.nodeRegistry = new NodeRegistry();
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflow: IWorkflow): Promise<{
    success: boolean;
    data: Record<string, INodeExecutionData[][]>;
    error?: string;
  }> {
    try {
      const executionOrder = this.getExecutionOrder(workflow);
      const nodeOutputs: Record<string, INodeExecutionData[][]> = {};

      // Execute nodes in order
      for (const node of executionOrder) {
        const nodeType = this.nodeRegistry.getNodeType(node.type);
        if (!nodeType) {
          throw new Error(`Node type "${node.type}" not found`);
        }

        // Get input data from connected nodes
        const inputData = this.getNodeInputData(node, workflow.connections, nodeOutputs);

        // Create execution context
        const context: INodeExecutionContext = {
          node,
          inputData,
          workflow,
          getNodeParameter: (parameterName: string, defaultValue?: unknown) => {
            return node.parameters[parameterName] ?? defaultValue;
          },
          helpers: {
            httpRequest: async (options) => {
              const axios = await import('axios');
              const response = await axios.default({
                method: options.method,
                url: options.url,
                headers: options.headers,
                data: options.body,
              });
              return response.data;
            },
          },
        };

        // Execute node
        const output = await nodeType.execute(context);
        nodeOutputs[node.id] = output;
      }

      return {
        success: true,
        data: nodeOutputs,
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get execution order using topological sort
   */
  private getExecutionOrder(workflow: IWorkflow): INode[] {
    const { nodes, connections } = workflow;
    const visited = new Set<string>();
    const order: INode[] = [];
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Build adjacency list
    const adjacency = new Map<string, string[]>();
    for (const node of nodes) {
      adjacency.set(node.id, []);
    }
    for (const conn of connections) {
      const targets = adjacency.get(conn.sourceNodeId) || [];
      targets.push(conn.targetNodeId);
      adjacency.set(conn.sourceNodeId, targets);
    }

    // DFS to get topological order
    const visit = (nodeId: string): void => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const targets = adjacency.get(nodeId) || [];
      for (const targetId of targets) {
        visit(targetId);
      }

      const node = nodeMap.get(nodeId);
      if (node) {
        order.unshift(node);
      }
    };

    // Find start nodes (nodes with no incoming connections)
    const hasIncoming = new Set(connections.map((c) => c.targetNodeId));
    const startNodes = nodes.filter((n) => !hasIncoming.has(n.id));

    for (const node of startNodes) {
      visit(node.id);
    }

    return order;
  }

  /**
   * Get input data for a node from its connections
   */
  private getNodeInputData(
    node: INode,
    connections: IConnection[],
    nodeOutputs: Record<string, INodeExecutionData[][]>
  ): INodeExecutionData[][] {
    const inputs: INodeExecutionData[][] = [];

    // Find all connections targeting this node
    const incomingConnections = connections.filter((c) => c.targetNodeId === node.id);

    if (incomingConnections.length === 0) {
      // No incoming connections, return empty input
      return [[]];
    }

    for (const conn of incomingConnections) {
      const sourceOutput = nodeOutputs[conn.sourceNodeId];
      if (sourceOutput && sourceOutput[conn.sourceOutput]) {
        inputs.push(sourceOutput[conn.sourceOutput]);
      }
    }

    return inputs.length > 0 ? inputs : [[]];
  }

  getNodeRegistry(): NodeRegistry {
    return this.nodeRegistry;
  }
}
