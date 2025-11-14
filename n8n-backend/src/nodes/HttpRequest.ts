import type { INodeType, INodeExecutionContext, INodeExecutionData } from '../types';

export const HttpRequestNode: INodeType = {
  name: 'HttpRequest',
  displayName: 'HTTP Request',
  description: 'Make HTTP requests to any URL',
  group: ['transform'],
  version: 1,
  defaults: {
    name: 'HTTP Request',
    color: '#0088cc',
  },
  inputs: ['main'],
  outputs: ['main'],
  properties: [
    {
      displayName: 'Method',
      name: 'method',
      type: 'options',
      options: [
        { name: 'GET', value: 'GET' },
        { name: 'POST', value: 'POST' },
        { name: 'PUT', value: 'PUT' },
        { name: 'DELETE', value: 'DELETE' },
        { name: 'PATCH', value: 'PATCH' },
      ],
      default: 'GET',
      required: true,
      description: 'The HTTP request method to use',
    },
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'https://api.example.com/endpoint',
      description: 'The URL to make the request to',
    },
    {
      displayName: 'Headers',
      name: 'headers',
      type: 'json',
      default: '{}',
      description: 'Headers to send with the request (JSON object)',
    },
    {
      displayName: 'Body',
      name: 'body',
      type: 'json',
      default: '{}',
      description: 'Body to send with the request (JSON object)',
    },
  ],
  async execute(context: INodeExecutionContext): Promise<INodeExecutionData[][]> {
    const method = context.getNodeParameter('method', 'GET') as string;
    const url = context.getNodeParameter('url', '') as string;
    const headersString = context.getNodeParameter('headers', '{}') as string;
    const bodyString = context.getNodeParameter('body', '{}') as string;

    if (!url) {
      throw new Error('URL is required');
    }

    // Parse headers and body
    let headers: Record<string, string> = {};
    let body: unknown;

    try {
      headers = JSON.parse(headersString);
    } catch {
      headers = {};
    }

    try {
      body = JSON.parse(bodyString);
    } catch {
      body = {};
    }

    // Make HTTP request
    try {
      const response = await context.helpers.httpRequest({
        method: method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        url,
        headers,
        body: method !== 'GET' && method !== 'DELETE' ? body : undefined,
      });

      return [[{ json: response as Record<string, unknown> }]];
    } catch (error) {
      throw new Error(
        `HTTP request failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
};
