import type { INodeType } from '../types';

export class NodeRegistry {
  private nodes: Map<string, INodeType> = new Map();

  /**
   * Register a node type
   */
  registerNode(nodeType: INodeType): void {
    this.nodes.set(nodeType.name, nodeType);
    console.log(`✅ Registered node: ${nodeType.name}`);
  }

  /**
   * Get a node type by name
   */
  getNodeType(name: string): INodeType | undefined {
    return this.nodes.get(name);
  }

  /**
   * Get all registered node types
   */
  getAllNodeTypes(): INodeType[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get node type metadata (without execute function for API responses)
   */
  getNodeTypeMetadata(name: string): Omit<INodeType, 'execute'> | undefined {
    const nodeType = this.nodes.get(name);
    if (!nodeType) return undefined;

    const { execute, ...metadata } = nodeType;
    return metadata;
  }

  /**
   * Get all node type metadata
   */
  getAllNodeTypeMetadata(): Array<Omit<INodeType, 'execute'>> {
    return Array.from(this.nodes.values()).map(({ execute, ...metadata }) => metadata);
  }
}
