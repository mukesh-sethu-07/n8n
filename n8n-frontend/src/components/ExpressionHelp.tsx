import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ExpressionHelp: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 border rounded-lg bg-blue-50 border-blue-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-sm font-medium text-blue-900 hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>Expression Syntax Help</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 py-2 border-t border-blue-200 space-y-3 text-sm">
          <div>
            <p className="font-medium text-blue-900 mb-1">Use dynamic data with expressions:</p>
            <code className="block bg-white px-2 py-1 rounded text-xs font-mono border border-blue-200">
              {'{{ expression }}'}
            </code>
          </div>

          <div>
            <p className="font-medium text-blue-900 mb-1">Available Variables:</p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>
                <code className="bg-white px-1 py-0.5 rounded">$json.fieldName</code> - Current item
                data
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">$node["NodeName"].json</code> -
                Previous node data
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">$itemIndex</code> - Current item
                index
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">$now</code> - Current timestamp
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">$today</code> - Today's date
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-blue-900 mb-1">Examples:</p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>
                <code className="bg-white px-1 py-0.5 rounded">
                  {'{{ $json.email }}'}
                </code>{' '}
                - Get email field
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">
                  {'{{ $json.price * 1.2 }}'}
                </code>{' '}
                - Calculate 20% markup
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">
                  {'{{ $node["Set"].json.url }}'}
                </code>{' '}
                - Use data from Set node
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">
                  Hello {'{{ $json.name }}'}, welcome!
                </code>{' '}
                - Inline expression
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              💡 <strong>Tip:</strong> Click on previous nodes in the canvas to see their names for
              $node references
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
