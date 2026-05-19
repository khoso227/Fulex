import React, { useState, useEffect } from 'react';
import { Check, Edit2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export function EditableText({ value, onSave, className, tagName: Tag = 'div' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full max-w-md">
        <input
          autoFocus
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={cn(
            "bg-brand-sidebar border border-brand-accent rounded px-2 py-1 outline-none w-full text-brand-text",
            className
          )}
        />
        <button onClick={handleSave} className="p-1 hover:text-green-500 transition-colors">
          <Check className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative inline-flex items-center gap-2">
      <Tag 
        onDoubleClick={() => setIsEditing(true)}
        className={cn("cursor-pointer", className)}
      >
        {currentValue}
      </Tag>
      <button 
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity p-1"
        title="Edit Text"
      >
        <Edit2 className="w-3 h-3" />
      </button>
    </div>
  );
}
