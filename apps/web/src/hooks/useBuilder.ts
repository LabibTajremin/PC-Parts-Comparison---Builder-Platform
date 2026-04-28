import { useBuilderStore } from '../stores/builderStore';
import { ComponentCategory } from '../types';

export function useBuilder() {
  const store = useBuilderStore();
  const selectedCount = Object.keys(store.selectedComponents).length;
  const hasErrors = store.compatibilityIssues.some((i) => i.type === 'error');

  const isComponentSelected = (category: ComponentCategory) =>
    !!store.selectedComponents[category];

  return {
    ...store,
    selectedCount,
    hasErrors,
    isComponentSelected,
  };
}
