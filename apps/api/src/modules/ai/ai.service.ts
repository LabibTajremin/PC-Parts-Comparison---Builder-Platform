import Anthropic from '@anthropic-ai/sdk';
import { cacheGet, cacheSet, hashFilters } from '../../shared/redis';
import { CACHE_KEYS, CACHE_TTL } from '../../shared/constants';
import { logger } from '../../shared/logger';

interface BuildAdviceParams {
  currentBuild: Record<string, unknown>;
  budget: number;
  useCase: string;
  availableProducts?: unknown[];
}

interface BuildAdvice {
  advice: string;
  suggestions: Array<{ category: string; reason: string; priority: 'high' | 'medium' | 'low' }>;
  warnings: string[];
  estimatedBudgetRange: { min: number; max: number; currency: string };
}

interface CompatibilityParams {
  component1: unknown;
  component2: unknown;
  issue: string;
}

export class AIService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async getBuildAdvice(params: BuildAdviceParams): Promise<BuildAdvice> {
    const cacheKey = CACHE_KEYS.AI_BUILD_ADVICE(hashFilters(params as Record<string, unknown>));
    const cached = await cacheGet<BuildAdvice>(cacheKey);
    if (cached) return cached;

    const systemPrompt = `You are an expert PC building advisor for a Bangladeshi PC parts platform.
You help users select compatible, value-for-money components.
Always respond in JSON format with this structure:
{
  "advice": "string - general advice",
  "suggestions": [{ "category": "CPU", "reason": "string", "priority": "high|medium|low" }],
  "warnings": ["string"],
  "estimatedBudgetRange": { "min": number, "max": number, "currency": "BDT" }
}
Keep advice concise, practical, and Bangladesh-market aware.`;

    const userMessage = `Current build: ${JSON.stringify(params.currentBuild)}
Budget: ${params.budget} BDT
Use case: ${params.useCase}
${params.availableProducts ? `Available products summary: ${JSON.stringify(params.availableProducts?.slice(0, 5))}` : ''}

Please provide build advice.`;

    let retries = 0;
    while (retries < 3) {
      try {
        const response = await this.client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const result: BuildAdvice = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : {
              advice: text,
              suggestions: [],
              warnings: [],
              estimatedBudgetRange: { min: params.budget * 0.8, max: params.budget * 1.2, currency: 'BDT' },
            };

        logger.info('AI build advice generated', { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens });
        await cacheSet(cacheKey, result, CACHE_TTL.AI_BUILD_ADVICE);
        return result;
      } catch (err: unknown) {
        const isRateLimit = err instanceof Error && err.message.includes('rate_limit');
        if (isRateLimit && retries < 2) {
          retries++;
          await new Promise((r) => setTimeout(r, Math.pow(2, retries) * 1000));
        } else {
          logger.error('AI build advice failed', err);
          return {
            advice: 'Unable to generate AI advice at this time. Please check component compatibility manually.',
            suggestions: [],
            warnings: [],
            estimatedBudgetRange: { min: params.budget * 0.8, max: params.budget * 1.2, currency: 'BDT' },
          };
        }
      }
    }

    return {
      advice: 'AI service temporarily unavailable.',
      suggestions: [],
      warnings: [],
      estimatedBudgetRange: { min: 0, max: 0, currency: 'BDT' },
    };
  }

  async explainCompatibility(params: CompatibilityParams): Promise<string> {
    const cacheKey = `ai:compat:${hashFilters(params as Record<string, unknown>)}`;
    const cached = await cacheGet<string>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Explain this PC compatibility issue in simple language for a user:
Component 1: ${JSON.stringify(params.component1)}
Component 2: ${JSON.stringify(params.component2)}
Issue: ${params.issue}

Give a brief explanation and suggest how to fix it.`,
          },
        ],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : 'Compatibility issue detected.';
      await cacheSet(cacheKey, text, CACHE_TTL.AI_COMPATIBILITY);
      return text;
    } catch (err) {
      logger.error('AI compatibility explanation failed', err);
      return params.issue;
    }
  }

  async normalizeProductName(rawName: string): Promise<{ canonicalName: string; brand: string; model: string }> {
    const cacheKey = `ai:normalize:${Buffer.from(rawName).toString('base64').slice(0, 32)}`;
    const cached = await cacheGet<{ canonicalName: string; brand: string; model: string }>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: `Normalize this PC product name to a canonical form. Return only JSON: {"canonicalName": "...", "brand": "...", "model": "..."}
Input: "${rawName}"`,
          },
        ],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const result = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { canonicalName: rawName, brand: '', model: rawName };

      await cacheSet(cacheKey, result, CACHE_TTL.AI_NORMALIZE);
      return result;
    } catch {
      return { canonicalName: rawName, brand: '', model: rawName };
    }
  }
}
