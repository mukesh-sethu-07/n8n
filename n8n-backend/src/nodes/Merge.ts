import type { INodeType, INodeExecutionContext, INodeExecutionData } from '../types';

export const MergeNode: INodeType = {
  name: 'Merge',
  displayName: 'Merge',
  description: 'Merge data from multiple inputs',
  group: ['transform'],
  version: 1,
  defaults: {
    name: 'Merge',
    color: '#00AAFF',
  },
  inputs: ['main', 'main'],
  outputs: ['main'],
  properties: [
    {
      displayName: 'Mode',
      name: 'mode',
      type: 'options',
      options: [
        { name: 'Append', value: 'append' },
        { name: 'Combine', value: 'combine' },
      ],
      default: 'append',
      description: 'How to merge the data',
    },
  ],
  async execute(context: INodeExecutionContext): Promise<INodeExecutionData[][]> {
    const mode = context.getNodeParameter('mode', 'append') as string;

    const input1 = context.inputData[0] || [];
    const input2 = context.inputData[1] || [];

    if (mode === 'append') {
      // Simply append all items from both inputs
      return [[...input1, ...input2]];
    } else if (mode === 'combine') {
      // Combine items pairwise
      const result: INodeExecutionData[] = [];
      const maxLength = Math.max(input1.length, input2.length);

      for (let i = 0; i < maxLength; i++) {
        const item1 = input1[i]?.json || {};
        const item2 = input2[i]?.json || {};
        result.push({ json: { ...item1, ...item2 } });
      }

      return [result];
    }

    return [[...input1, ...input2]];
  },
};
