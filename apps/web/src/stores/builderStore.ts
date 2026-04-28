import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentCategory, Product, SelectedComponents, CompatibilityIssue, BuildValidationResult } from '../types';
import { builderApi } from '../lib/api';

interface BuilderState {
  selectedComponents: SelectedComponents;
  totalPrice: number;
  lowestTotalPrice: number;
  compatibilityIssues: CompatibilityIssue[];
  isChecking: boolean;
  currentStep: number;

  selectComponent: (category: ComponentCategory, product: Product) => void;
  removeComponent: (category: ComponentCategory) => void;
  clearBuild: () => void;
  checkCompatibility: () => Promise<BuildValidationResult | null>;
  setStep: (step: number) => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      selectedComponents: {},
      totalPrice: 0,
      lowestTotalPrice: 0,
      compatibilityIssues: [],
      isChecking: false,
      currentStep: 0,

      selectComponent: (category, product) => {
        const current = get().selectedComponents;
        const updated = { ...current, [category]: product };
        const total = Object.values(updated).reduce(
          (sum, p) => sum + (p?.lowestPrice?.price || 0),
          0
        );
        set({ selectedComponents: updated, totalPrice: total, lowestTotalPrice: total });
      },

      removeComponent: (category) => {
        const current = { ...get().selectedComponents };
        delete current[category];
        const total = Object.values(current).reduce(
          (sum, p) => sum + (p?.lowestPrice?.price || 0),
          0
        );
        set({ selectedComponents: current, totalPrice: total, lowestTotalPrice: total });
      },

      clearBuild: () => {
        set({ selectedComponents: {}, totalPrice: 0, lowestTotalPrice: 0, compatibilityIssues: [], currentStep: 0 });
      },

      checkCompatibility: async () => {
        const { selectedComponents } = get();
        const ids: Record<string, string> = {};
        for (const [cat, product] of Object.entries(selectedComponents)) {
          if (product) ids[cat] = product.id;
        }

        if (Object.keys(ids).length === 0) return null;

        set({ isChecking: true });
        try {
          const result = await builderApi.validate(ids);
          const validation = result.data!;
          set({ compatibilityIssues: validation.issues, isChecking: false });
          return validation;
        } catch {
          set({ isChecking: false });
          return null;
        }
      },

      setStep: (step) => set({ currentStep: step }),
    }),
    {
      name: 'pc-builder-storage',
      partialize: (state) => ({
        selectedComponents: state.selectedComponents,
        currentStep: state.currentStep,
      }),
    }
  )
);
