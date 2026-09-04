import { CatalogTools } from '@/lib/tools';
import { ProductItem } from '@/types';

export interface ParsedBuyerIntent {
  category?: string;
  maxBudget?: number;
  keywords: string[];
  intentType: 'SEARCH' | 'CHEAPEST' | 'SPECS' | 'UPSELL_QUERY' | 'GENERAL_QA';
  rawPrompt: string;
}

export class AIProvider {
  /**
   * Parse user query into structured agent intent
   */
  static async parseBuyerIntent(prompt: string): Promise<ParsedBuyerIntent> {
    const p = prompt.toLowerCase();
    const keywords: string[] = [];

    // Budget extraction (e.g. "under ₹6,000", "under 6000", "below 70000", "under 50000")
    let maxBudget: number | undefined = undefined;
    const budgetMatch = prompt.match(/(?:under|below|less than|within|budget|max|₹|\$)\s*₹?\s*([\d,]+)/i);
    if (budgetMatch) {
      const parsedNum = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(parsedNum) && parsedNum > 100) {
        maxBudget = parsedNum;
      }
    }

    // Category detection
    let category: string | undefined = undefined;
    if (p.includes('keyboard') || p.includes('keychron') || p.includes('switches') || p.includes('typing')) {
      category = 'Electronics';
      keywords.push('keyboard', 'mechanical');
    } else if (p.includes('laptop') || p.includes('developerbook') || p.includes('macbook') || p.includes('computer')) {
      category = 'Electronics';
      keywords.push('laptop', 'coding');
    } else if (p.includes('monitor') || p.includes('screen') || p.includes('display')) {
      category = 'Electronics';
      keywords.push('monitor', 'ultrawide');
    } else if (p.includes('mouse') || p.includes('stand') || p.includes('wrist rest') || p.includes('hub')) {
      category = 'Accessories';
      keywords.push('accessory');
    }

    // Intent type determination
    let intentType: ParsedBuyerIntent['intentType'] = 'SEARCH';
    if (p.includes('cheapest') || p.includes('lowest price') || p.includes('budget option')) {
      intentType = 'CHEAPEST';
    } else if (p.includes('ram') || p.includes('specs') || p.includes('most memory') || p.includes('cpu')) {
      intentType = 'SPECS';
    } else if (p.includes('anything else') || p.includes('recommend accessories') || p.includes('need anything')) {
      intentType = 'UPSELL_QUERY';
    } else if (p.includes('how') || p.includes('what') || p.includes('why') || p.includes('compare')) {
      intentType = 'GENERAL_QA';
    }

    return {
      category,
      maxBudget,
      keywords,
      intentType,
      rawPrompt: prompt,
    };
  }

  /**
   * Process intent and query real merchant catalog tools to form explainable recommendations
   */
  static async processBuyerQuery(prompt: string): Promise<{
    replyText: string;
    recommendedProduct: ProductItem | null;
    matchedProducts: ProductItem[];
    intent: ParsedBuyerIntent;
  }> {
    const intent = await this.parseBuyerIntent(prompt);
    const catalog = await CatalogTools.searchCatalog({
      maxPrice: intent.maxBudget,
      query: intent.keywords.join(' '),
    });

    let recommendedProduct: ProductItem | null = null;
    let replyText = '';

    if (catalog.length > 0) {
      if (intent.intentType === 'CHEAPEST') {
        const sorted = [...catalog].sort((a, b) => a.price - b.price);
        recommendedProduct = sorted[0];
        replyText = `The most budget-friendly option matching your request is the **${recommendedProduct.name}** at ₹${recommendedProduct.price.toLocaleString('en-IN')}.\n\nIt offers ${recommendedProduct.description}`;
      } else {
        recommendedProduct = catalog[0];
        const budgetNotice = intent.maxBudget
          ? `Within your budget of ₹${intent.maxBudget.toLocaleString('en-IN')}, `
          : '';

        replyText = `${budgetNotice}I recommend the **${recommendedProduct.name}** priced at ₹${recommendedProduct.price.toLocaleString('en-IN')}.\n\n**Why this matches your needs:**\n${recommendedProduct.features.map(f => `• ${f}`).join('\n')}\n\n*Rationale:* ${recommendedProduct.description}`;
      }
    } else {
      // Fallback search with broader criteria
      const allProducts = await CatalogTools.searchCatalog({});
      recommendedProduct = allProducts[0];
      replyText = `I couldn't find an exact match under your specified filters, but here is our top-rated flagship item: **${recommendedProduct.name}** for ₹${recommendedProduct.price.toLocaleString('en-IN')}.`;
    }

    return {
      replyText,
      recommendedProduct,
      matchedProducts: catalog.slice(0, 4),
      intent,
    };
  }
}
