import type { INodeExecutionData, INode, IWorkflow } from '../types';

/**
 * Expression Engine for dynamic parameter resolution
 * Supports {{ }} syntax with variable access and JavaScript expressions
 */
export class ExpressionEngine {
  /**
   * Resolve expressions in a value
   * Supports: {{ $json.field }}, {{ $node["NodeName"].json.field }}, {{ 1 + 1 }}
   */
  resolveExpression(
    value: unknown,
    context: {
      currentItem: INodeExecutionData;
      currentNode: INode;
      workflow: IWorkflow;
      nodeOutputs: Record<string, INodeExecutionData[][]>;
      itemIndex: number;
    }
  ): unknown {
    // Only process strings
    if (typeof value !== 'string') {
      return value;
    }

    // Check if the entire value is an expression
    const fullExpressionMatch = value.match(/^{{\s*(.+)\s*}}$/);
    if (fullExpressionMatch) {
      const expression = fullExpressionMatch[1];
      return this.evaluateExpression(expression, context);
    }

    // Replace inline expressions
    return value.replace(/{{\s*(.+?)\s*}}/g, (match, expression) => {
      const result = this.evaluateExpression(expression, context);
      return String(result);
    });
  }

  /**
   * Evaluate a JavaScript expression with workflow context
   */
  private evaluateExpression(
    expression: string,
    context: {
      currentItem: INodeExecutionData;
      currentNode: INode;
      workflow: IWorkflow;
      nodeOutputs: Record<string, INodeExecutionData[][]>;
      itemIndex: number;
    }
  ): unknown {
    try {
      // Create context variables
      const variables: Record<string, unknown> = {
        // Current item data
        $json: context.currentItem.json,

        // Binary data (if exists)
        $binary: context.currentItem.binary || {},

        // Item index
        $itemIndex: context.itemIndex,

        // Workflow info
        $workflow: {
          id: context.workflow.id,
          name: context.workflow.name,
          active: context.workflow.active,
        },

        // Access other nodes' data (by ID or name)
        $node: this.createNodeAccessor(context.nodeOutputs, context.workflow),

        // Utility functions
        $now: Date.now(),
        $today: new Date().toISOString().split('T')[0],
      };

      // Create a safe evaluation function
      const evalFunction = new Function(
        ...Object.keys(variables),
        `return ${expression};`
      );

      // Execute with context
      return evalFunction(...Object.values(variables));
    } catch (error) {
      console.error('Expression evaluation error:', error);
      throw new Error(
        `Expression evaluation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create an accessor object for $node variable
   * Allows: $node["NodeName"].json or $node["node_id"].json
   * Supports both node names AND node IDs for flexibility
   */
  private createNodeAccessor(
    nodeOutputs: Record<string, INodeExecutionData[][]>,
    workflow: IWorkflow
  ): Record<string, unknown> {
    const accessor: Record<string, unknown> = {};

    // Create a map of node ID to node name
    const nodeIdToName = new Map<string, string>();
    const nodeNameToId = new Map<string, string>();

    for (const node of workflow.nodes) {
      nodeIdToName.set(node.id, node.name);
      nodeNameToId.set(node.name, node.id);
    }

    // Create accessor for each node by both ID and name
    for (const [nodeId, outputs] of Object.entries(nodeOutputs)) {
      // Get the first output and first item (most common case)
      const firstOutput = outputs[0] || [];
      const firstItem = firstOutput[0];

      if (firstItem) {
        const nodeData = {
          json: firstItem.json,
          binary: firstItem.binary || {},
          itemIndex: 0,
          all: firstOutput, // Access to all items
        };

        // Add by node ID
        accessor[nodeId] = nodeData;

        // Also add by node name for user convenience
        const nodeName = nodeIdToName.get(nodeId);
        if (nodeName) {
          accessor[nodeName] = nodeData;
        }
      }
    }

    return accessor;
  }

  /**
   * Resolve all expressions in node parameters
   */
  resolveNodeParameters(
    parameters: Record<string, unknown>,
    context: {
      currentItem: INodeExecutionData;
      currentNode: INode;
      workflow: IWorkflow;
      nodeOutputs: Record<string, INodeExecutionData[][]>;
      itemIndex: number;
    }
  ): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(parameters)) {
      resolved[key] = this.resolveValue(value, context);
    }

    return resolved;
  }

  /**
   * Recursively resolve expressions in any value type
   */
  private resolveValue(
    value: unknown,
    context: {
      currentItem: INodeExecutionData;
      currentNode: INode;
      workflow: IWorkflow;
      nodeOutputs: Record<string, INodeExecutionData[][]>;
      itemIndex: number;
    }
  ): unknown {
    if (typeof value === 'string') {
      return this.resolveExpression(value, context);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.resolveValue(item, context));
    }

    if (value !== null && typeof value === 'object') {
      const resolved: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        resolved[key] = this.resolveValue(val, context);
      }
      return resolved;
    }

    return value;
  }
}
