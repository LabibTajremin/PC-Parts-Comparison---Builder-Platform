export const COMPONENT_CATEGORIES = [
  'CPU', 'GPU', 'RAM', 'MOTHERBOARD', 'STORAGE',
  'PSU', 'CASE', 'COOLING', 'MONITOR', 'KEYBOARD', 'MOUSE',
] as const;

export type ComponentCategory = typeof COMPONENT_CATEGORIES[number];
