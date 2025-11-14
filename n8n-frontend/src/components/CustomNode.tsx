import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';
import type { INode } from '@/types';
import { cn } from '@/lib/utils';

interface CustomNodeProps {
  data: INode & {
    onDelete: () => void;
    onUpdate: (updates: Partial<INode>) => void;
    onClick: () => void;
    isSelected: boolean;
  };
  selected?: boolean;
}

export const CustomNode = memo(({ data, selected }: CustomNodeProps) => {
  const getNodeColor = (type: string): string => {
    const colors: Record<string, string> = {
      Start: 'bg-green-500',
      HttpRequest: 'bg-blue-500',
      Set: 'bg-indigo-500',
      Code: 'bg-orange-500',
      If: 'bg-emerald-600',
      Switch: 'bg-lime-600',
      Merge: 'bg-cyan-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div
      onClick={data.onClick}
      className={cn(
        'px-4 py-2 shadow-lg rounded-lg border-2 bg-white min-w-[150px] cursor-pointer',
        'hover:shadow-xl transition-all',
        selected || data.isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-gray-300'
      )}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2" id="input-0" />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', getNodeColor(data.type))} />
          <div className="text-sm font-medium text-gray-900">{data.name}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete();
          }}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-1">{data.type}</div>

      <Handle type="source" position={Position.Right} className="w-2 h-2" id="output-0" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
