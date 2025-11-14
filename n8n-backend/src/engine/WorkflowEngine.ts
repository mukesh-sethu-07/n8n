import type {
  IWorkflow,
  INode,
  IConnection,
  INodeExecutionData,
  INodeExecutionContext,
  INodeType,
} from '../types';
import { NodeRegistry } from './NodeRegistry';
import { ExpressionEngine } from './ExpressionEngine';

export class WorkflowEngine {
  private nodeRegistry: NodeRegistry;
  private expressionEngine: ExpressionEngine;

  constructor() {
    this.nodeRegistry = new NodeRegistry();
    this.expressionEngine = new ExpressionEngine();
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

        // Process each input item and resolve expressions
        const processedInputData: INodeExecutionData[][] = [];

        for (const inputBatch of inputData) {
          const processedBatch: INodeExecutionData[] = [];

          for (let itemIndex = 0; itemIndex < inputBatch.length; itemIndex++) {
            const item = inputBatch[itemIndex];

            // Resolve expressions in parameters for this specific item
            const resolvedParameters = this.expressionEngine.resolveNodeParameters(
              node.parameters,
              {
                currentItem: item,
                currentNode: node,
                workflow,
                nodeOutputs,
                itemIndex,
              }
            );

            // Store resolved parameters temporarily for this execution
            const nodeWithResolvedParams = {
              ...node,
              parameters: resolvedParameters,
            };

            // Create execution context
            const context: INodeExecutionContext = {
              node: nodeWithResolvedParams,
              inputData: [[item]], // Single item for expression resolution
              workflow,
              getNodeParameter: (parameterName: string, defaultValue?: unknown) => {
                return resolvedParameters[parameterName] ?? defaultValue;
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

            // Execute node for this single item
            const itemOutput = await nodeType.execute(context);

            // Collect output from this item
            if (itemOutput[0]) {
              processedBatch.push(...itemOutput[0]);
            }
          }

          processedInputData.push(processedBatch);
        }

        // If no input items (e.g., Start node), execute once with empty input
        if (inputData.length === 0 || (inputData.length === 1 && inputData[0].length === 0)) {
          const resolvedParameters = this.expressionEngine.resolveNodeParameters(
            node.parameters,
            {
              currentItem: { json: {} },
              currentNode: node,
              workflow,
              nodeOutputs,
              itemIndex: 0,
            }
          );

          const nodeWithResolvedParams = {
            ...node,
            parameters: resolvedParameters,
          };

          const context: INodeExecutionContext = {
            node: nodeWithResolvedParams,
            inputData: [[]],
            workflow,
            getNodeParameter: (parameterName: string, defaultValue?: unknown) => {
              return resolvedParameters[parameterName] ?? defaultValue;
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

          const output = await nodeType.execute(context);
          nodeOutputs[node.id] = output;
        } else {
          nodeOutputs[node.id] = processedInputData;
        }
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
