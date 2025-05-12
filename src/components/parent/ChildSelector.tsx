
import React from 'react';
import { cn } from '@/lib/utils';

export interface ChildData {
  id: number;
  name: string;
  class: string;
  rollNo: string;
  // Additional fields that may be used in different contexts
  age?: number;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  joiningDate?: string;
}

interface ChildSelectorProps {
  children: ChildData[];
  selectedChild: ChildData;
  onSelectChild: (child: ChildData) => void;
  className?: string;
}

const ChildSelector = ({ children, selectedChild, onSelectChild, className }: ChildSelectorProps) => {
  if (children.length <= 1) return null;
  
  return (
    <div className={cn("card-wrapper mb-6", className)}>
      <h2 className="section-title">Select Child</h2>
      <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
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
