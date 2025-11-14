import type { INodeType, INodeExecutionContext, INodeExecutionData } from '../types';

export const IfNode: INodeType = {
  name: 'If',
  displayName: 'IF',
  description: 'Split workflow based on condition',
  group: ['transform'],
  version: 1,
  defaults: {
    name: 'IF',
    color: '#408000',
  },
  inputs: ['main'],
  outputs: ['main', 'main'], // true, false
  properties: [
    {
      displayName: 'Condition',
      name: 'condition',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'field === "value"',
      description: 'JavaScript expression to evaluate (use item.field to access data)',
    },
  ],
  async execute(context: INodeExecutionContext): Promise<INodeExecutionData[][]> {
    const condition = context.getNodeParameter('condition', '') as string;

    if (!condition.trim()) {
      throw new Error('Condition cannot be empty');
    }

    const inputData = context.inputData[0] || [];
    const trueData: INodeExecutionData[] = [];
    const falseData: INodeExecutionData[] = [];

    for (const item of inputData) {
      try {
        // Create a function to evaluate the condition
        const evalFunction = new Function('item', `return ${condition};`);
        const result = evalFunction(item.json);

        if (result) {
          trueData.push(item);
        } else {
          falseData.push(item);
        }
      } catch (error) {
        throw new Error(
          `Condition evaluation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    return [trueData, falseData];
  },
};
