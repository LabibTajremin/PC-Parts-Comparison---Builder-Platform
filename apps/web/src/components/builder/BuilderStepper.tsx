'use client';

import { ComponentCategory, BUILDER_STEPS } from '../../types';
import { useBuilderStore } from '../../stores/builderStore';
import { getCategoryLabel } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface BuilderStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  [ComponentCategory.CPU]: '💻',
  [ComponentCategory.MOTHERBOARD]: '🔌',
  [ComponentCategory.RAM]: '🧠',
  [ComponentCategory.GPU]: '🎮',
  [ComponentCategory.STORAGE]: '💾',
  [ComponentCategory.PSU]: '⚡',
  [ComponentCategory.CASE]: '🖥️',
};

export default function BuilderStepper({ currentStep, onStepClick }: BuilderStepperProps) {
  const { selectedComponents } = useBuilderStore();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap gap-2">
        {BUILDER_STEPS.map((category, index) => {
          const isSelected = !!selectedComponents[category];
          const isCurrent = index === currentStep;

          return (
            <button
              key={category}
              onClick={() => onStepClick(index)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition border',
                isCurrent
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : isSelected
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              )}
            >
              <span>{CATEGORY_ICONS[category]}</span>
              <span>{getCategoryLabel(category)}</span>
              {isSelected && !isCurrent && <span className="text-green-600">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
