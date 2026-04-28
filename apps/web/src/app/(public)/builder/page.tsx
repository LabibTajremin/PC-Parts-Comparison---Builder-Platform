'use client';

import { useState } from 'react';
import { BUILDER_STEPS, ComponentCategory } from '../../../types';
import BuilderStepper from '../../../components/builder/BuilderStepper';
import ComponentSelector from '../../../components/builder/ComponentSelector';
import BuildSummary from '../../../components/builder/BuildSummary';
import AIAdvisor from '../../../components/ai/AIAdvisor';
import { useBuilderStore } from '../../../stores/builderStore';

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { selectedComponents } = useBuilderStore();

  const currentCategory = BUILDER_STEPS[currentStep];

  const goNext = () => {
    if (currentStep < BUILDER_STEPS.length - 1) setCurrentStep((s) => s + 1);
  };
  const goPrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">PC Builder</h1>
      <p className="text-gray-500 mb-6">Build your custom PC step by step</p>

      <BuilderStepper currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component selector */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ComponentSelector category={currentCategory as ComponentCategory} />

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={goPrev}
                disabled={currentStep === 0}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
              >
                ← Previous
              </button>
              <div className="text-sm text-gray-500 flex items-center">
                Step {currentStep + 1} of {BUILDER_STEPS.length}
              </div>
              <button
                onClick={goNext}
                disabled={currentStep === BUILDER_STEPS.length - 1}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {selectedComponents[currentCategory] ? 'Next →' : 'Skip →'}
              </button>
            </div>
          </div>

          {/* AI Advisor */}
          <div className="mt-6">
            <AIAdvisor />
          </div>
        </div>

        {/* Build Summary sidebar */}
        <div>
          <BuildSummary />
        </div>
      </div>
    </div>
  );
}
