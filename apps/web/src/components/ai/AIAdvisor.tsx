'use client';

import { useState } from 'react';
import { aiApi } from '../../lib/api';
import { useBuilderStore } from '../../stores/builderStore';
import { formatPrice } from '../../lib/utils';

interface BuildAdvice {
  advice: string;
  suggestions: Array<{ category: string; reason: string; priority: 'high' | 'medium' | 'low' }>;
  warnings: string[];
  estimatedBudgetRange: { min: number; max: number; currency: string };
}

export default function AIAdvisor() {
  const [budget, setBudget] = useState('');
  const [useCase, setUseCase] = useState('gaming');
  const [advice, setAdvice] = useState<BuildAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { selectedComponents } = useBuilderStore();

  const handleGetAdvice = async () => {
    if (!budget) { setError('Please enter your budget'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await aiApi.getBuildAdvice({
        currentBuild: Object.fromEntries(
          Object.entries(selectedComponents).map(([cat, product]) => [cat, product?.name])
        ),
        budget: Number(budget),
        useCase,
      });
      setAdvice(result.data as BuildAdvice);
    } catch {
      setError('Failed to get AI advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🤖</span>
        <h2 className="text-xl font-bold text-gray-900">AI Build Advisor</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Budget in BDT (e.g. 80000)"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="gaming">Gaming</option>
          <option value="office">Office Work</option>
          <option value="programming">Programming</option>
          <option value="video editing">Video Editing</option>
          <option value="general">General Use</option>
        </select>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Get Advice'}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {advice && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900">{advice.advice}</p>
          </div>

          {advice.estimatedBudgetRange && (
            <div className="text-sm text-gray-600">
              Estimated budget range: {formatPrice(advice.estimatedBudgetRange.min)} – {formatPrice(advice.estimatedBudgetRange.max)}
            </div>
          )}

          {advice.suggestions && advice.suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Suggestions</h3>
              <div className="space-y-2">
                {advice.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[s.priority]}`}>
                      {s.priority}
                    </span>
                    <div>
                      <span className="font-medium">{s.category}: </span>
                      <span className="text-gray-600">{s.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {advice.warnings && advice.warnings.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Warnings</h3>
              <ul className="space-y-1">
                {advice.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span>⚠</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
