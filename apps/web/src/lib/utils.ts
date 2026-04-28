import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'BDT'): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency === 'BDT' ? 'BDT' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('BDT', '৳');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    CPU: 'Processor (CPU)',
    GPU: 'Graphics Card (GPU)',
    RAM: 'Memory (RAM)',
    STORAGE: 'Storage',
    MOTHERBOARD: 'Motherboard',
    PSU: 'Power Supply (PSU)',
    CASE: 'Case',
  };
  return labels[category] || category;
}
