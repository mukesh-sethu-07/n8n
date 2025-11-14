import React, { useState } from 'react';
import type { INode, INodeProperty } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ExpressionHelp } from './ExpressionHelp';
import { X, Play, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NodeDetailViewProps {
  node: INode;
  nodeTypeName: string;
  properties: INodeProperty[];
  executionData?: {
    json: Record<string, unknown>;
  }[];
  onClose: () => void;
  onUpdate: (parameters: Record<string, unknown>) => void;
  onExecute?: () => void;
}

export const NodeDetailView: React.FC<NodeDetailViewProps> = ({
  node,
  nodeTypeName,
  properties,
  executionData,
  onClose,
  onUpdate,
  onExecute,
}) => {
  const [parameters, setParameters] = useState<Record<string, unknown>>(node.parameters || {});
  const [activeTab, setActiveTab] = useState<'parameters' | 'output'>('parameters');

  const handleParameterChange = (name: string, value: unknown) => {
    const updated = { ...parameters, [name]: value };
    setParameters(updated);
    onUpdate(updated);
  };

  const renderParameterInput = (property: INodeProperty) => {
    const value = parameters[property.name] ?? property.default;

    switch (property.type) {
      case 'string':
        return (
          <Input
            type="text"
            value={value as string}
            onChange={(e) => handleParameterChange(property.name, e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value as number}
            onChange={(e) => handleParameterChange(property.name, Number(e.target.value))}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => handleParameterChange(property.name, e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Enabled</span>
          </label>
        );

      case 'options':
        return (
          <select
            value={value as string}
            onChange={(e) => handleParameterChange(property.name, e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            {property.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        );

      case 'json':
        return (
          <textarea
            value={value as string}
            onChange={(e) => handleParameterChange(property.name, e.target.value)}
            placeholder={property.placeholder}
            className="w-full px-3 py-2 border rounded-md font-mono text-sm min-h-[100px]"
          />
        );

      default:
        return (
          <Input
            type="text"
            value={String(value)}
            onChange={(e) => handleParameterChange(property.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[500px] bg-white shadow-2xl border-l z-50 flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{node.name}</h2>
            <p className="text-xs text-muted-foreground">{nodeTypeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onExecute && (
            <Button size="sm" variant="outline" onClick={onExecute}>
              <Play className="w-4 h-4 mr-1" />
              Test
            </Button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex">
        <button
          onClick={() => setActiveTab('parameters')}
          className={cn(
            'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
            activeTab === 'parameters'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          Parameters
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={cn(
            'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
            activeTab === 'output'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          Output
          {executionData && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
              {executionData.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'parameters' ? (
          <div className="p-6 space-y-6">
            {/* Expression Help */}
            <ExpressionHelp />

            {properties.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No parameters to configure</p>
              </div>
            ) : (
              properties.map((property) => (
                <div key={property.name} className="space-y-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-900">
                      {property.displayName}
                      {property.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    {property.description && (
                      <p className="text-xs text-gray-500 mt-1">{property.description}</p>
                    )}
                  </label>
                  {renderParameterInput(property)}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-6">
            {executionData && executionData.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">
                    {executionData.length} item{executionData.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {executionData.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">Item {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-[300px]">
                        {JSON.stringify(item.json, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No output data</p>
                <p className="text-sm mt-1">Execute the workflow to see results</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
