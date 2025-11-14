import type { INodeType, INodeExecutionContext, INodeExecutionData } from '../types';

export const SetNode: INodeType = {
  name: 'Set',
  displayName: 'Set',
  description: 'Set values in data',
  group: ['transform'],
  version: 1,
  defaults: {
    name: 'Set',
    color: '#0055BB',
  },
  inputs: ['main'],
  outputs: ['main'],
  properties: [
    {
      displayName: 'Values',
      name: 'values',
      type: 'json',
      default: '{}',
      required: true,
      description: 'Values to set (JSON object)',
    },
    {
      displayName: 'Keep Only Set',
      name: 'keepOnlySet',
      type: 'boolean',
      default: false,
      description: 'If true, only keep the values that were set',
    },
  ],
  async execute(context: INodeExecutionContext): Promise<INodeExecutionData[][]> {
    const valuesString = context.getNodeParameter('values', '{}') as string;
    const keepOnlySet = context.getNodeParameter('keepOnlySet', false) as boolean;

    let values: Record<string, unknown> = {};
    try {
      values = JSON.parse(valuesString);
    } catch {
      throw new Error('Values must be valid JSON');
    }

    const inputData = context.inputData[0] || [];
    const returnData: INodeExecutionData[] = [];

    // Process each input item
    for (const item of inputData) {
      if (keepOnlySet) {
        returnData.push({ json: { ...values } });
      } else {
        returnData.push({ json: { ...item.json, ...values } });
      }
    }

    // If no input data, create one item with the values
    if (returnData.length === 0) {
      returnData.push({ json: values });
    }

    return [returnData];
  },
};
