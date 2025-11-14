import type { INodeType, INodeExecutionContext, INodeExecutionData } from '../types';

export const StartNode: INodeType = {
  name: 'Start',
  displayName: 'Start',
  description: 'Start point of the workflow',
  group: ['trigger'],
  version: 1,
  defaults: {
    name: 'Start',
    color: '#00AA00',
  },
  inputs: [],
  outputs: ['main'],
  properties: [],
  async execute(context: INodeExecutionContext): Promise<INodeExecutionData[][]> {
    // Start node just passes through empty data or creates initial data
    const inputData = context.inputData[0];

    if (inputData && inputData.length > 0) {
      return [inputData];
    }

    // If no input, create a default empty item
    return [[{ json: {} }]];
  },
};
