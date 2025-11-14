import type { INodeType, INodeExecutionContext, INodeExecutionData } from '../types';
import { VM } from 'vm2';

export const CodeNode: INodeType = {
  name: 'Code',
  displayName: 'Code',
  description: 'Run custom JavaScript code',
  group: ['transform'],
  version: 1,
  defaults: {
    name: 'Code',
    color: '#FF9922',
  },
  inputs: ['main'],
  outputs: ['main'],
  properties: [
    {
      displayName: 'JavaScript Code',
      name: 'code',
      type: 'string',
      default: '// Access input data with $input\n// Return data with return statement\n\nreturn $input.map(item => ({\n  ...item,\n  processed: true\n}));',
      required: true,
      description: 'JavaScript code to execute. Use $input to access input data.',
    },
  ],
  async execute(context: INodeExecutionContext): Promise<INodeExecutionData[][]> {
    const code = context.getNodeParameter('code', '') as string;

    if (!code.trim()) {
      throw new Error('Code cannot be empty');
    }

    const inputData = context.inputData[0] || [];
    const inputJson = inputData.map((item) => item.json);

    try {
      // Create sandboxed VM
      const vm = new VM({
        timeout: 5000, // 5 second timeout
        sandbox: {
          $input: inputJson,
          console: {
            log: (...args: unknown[]) => console.log('[Code Node]', ...args),
          },
        },
      });

      // Execute code
      const result = vm.run(code);

      // Convert result to execution data format
      let returnData: INodeExecutionData[] = [];

      if (Array.isArray(result)) {
        returnData = result.map((item) => ({
          json: typeof item === 'object' && item !== null ? item : { value: item },
        }));
      } else if (typeof result === 'object' && result !== null) {
        returnData = [{ json: result }];
      } else {
        returnData = [{ json: { value: result } }];
      }

      return [returnData];
    } catch (error) {
      throw new Error(
        `Code execution failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
};
