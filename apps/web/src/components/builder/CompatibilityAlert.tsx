'use client';

import { CompatibilityIssue } from '../../types';
import { useState } from 'react';
import { aiApi } from '../../lib/api';

interface CompatibilityAlertProps {
  issues: CompatibilityIssue[];
  components?: Record<string, unknown>;
}

export default function CompatibilityAlert({ issues }: CompatibilityAlertProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');

  if (issues.length === 0) return null;

  const getAIExplanation = async (issue: CompatibilityIssue) => {
    setLoadingExplanation(true);
    try {
      const result = await aiApi.checkCompatibility({
        component1: issue.components[0],
        component2: issue.components[1],
        issue: issue.message,
      });
      setExplanation(result.data?.explanation || issue.message);
    } catch {
      setExplanation(issue.message);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <div className="space-y-3">
      {errors.map((issue, i) => (
        <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-lg mt-0.5">⚠</span>
              <div>
                <p className="font-medium text-red-900">Compatibility Error</p>
                <p className="text-sm text-red-700 mt-1">{issue.message}</p>
                {explanation && (
                  <p className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded">{explanation}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => getAIExplanation(issue)}
              disabled={loadingExplanation}
              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition whitespace-nowrap"
            >
              {loadingExplanation ? 'Loading...' : '🤖 Explain'}
            </button>
          </div>
        </div>
      ))}

      {warnings.map((issue, i) => (
        <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-yellow-500 text-lg mt-0.5">⚡</span>
            <div>
              <p className="font-medium text-yellow-900">Warning</p>
              <p className="text-sm text-yellow-700 mt-1">{issue.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
