import type { INodeType, INodeExecutionContext, INodeExecutionData } from '../types';

export const SwitchNode: INodeType = {
  name: 'Switch',
  displayName: 'Switch',
  description: 'Route items to different outputs based on value',
  group: ['transform'],
  version: 1,
  defaults: {
    name: 'Switch',
    color: '#506000',
  },
  inputs: ['main'],
  outputs: ['main', 'main', 'main', 'main'], // Up to 4 outputs
  properties: [
    {
      displayName: 'Mode',
      name: 'mode',
      type: 'options',
      options: [
        { name: 'Expression', value: 'expression' },
        { name: 'Rules', value: 'rules' },
      ],
      default: 'expression',
      description: 'How to determine the output',
    },
    {
      displayName: 'Value',
      name: 'value',
      type: 'string',
      default: '',
      description: 'Field to switch on (e.g., item.status)',
    },
  ],
  async execute(context: INodeExecutionContext): Promise<INodeExecutionData[][]> {
    const mode = context.getNodeParameter('mode', 'expression') as string;
    const value = context.getNodeParameter('value', '') as string;

    const inputData = context.inputData[0] || [];
    const outputs: INodeExecutionData[][] = [[], [], [], []];

    for (const item of inputData) {
      try {
        // Simple routing based on hash of value
        const evalFunction = new Function('item', `return ${value};`);
        const result = evalFunction(item.json);
        const resultString = String(result);

        // Route to output based on simple hash
        const outputIndex = Math.abs(this.simpleHash(resultString)) % 4;
        outputs[outputIndex].push(item);
      } catch (error) {
        // If evaluation fails, route to first output
        outputs[0].push(item);
      }
    }

    return outputs;
  },
  simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  },
} as INodeType & { simpleHash: (str: string) => number };
