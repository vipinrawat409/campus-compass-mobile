
import React from 'react';
import { cn } from '@/lib/utils';

interface ChildData {
  id: number;
  name: string;
  class: string;
  rollNo: string;
}

interface ChildSelectorProps {
  children: ChildData[];
  selectedChild: ChildData;
  onSelectChild: (child: ChildData) => void;
}

const ChildSelector = ({ children, selectedChild, onSelectChild }: ChildSelectorProps) => {
  if (children.length <= 1) return null;
  
  return (
    <div className="card-wrapper mb-6">
      <h2 className="section-title">Select Child</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {children.map((child) => (
          <button
            key={child.id}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedChild.id === child.id 
                ? "bg-primary text-white" 
                : "bg-soft-blue hover:bg-soft-blue/80"
            )}
            onClick={() => onSelectChild(child)}
          >
            {child.name} ({child.class})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChildSelector;
