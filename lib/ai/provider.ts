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

    // Budget extraction (e.g. "under ₹6,000", "under 6000", "below 70000", "under 50000", "under ₹2,000")
    let maxBudget: number | undefined = undefined;
    const budgetMatch = prompt.match(/(?:under|below|less than|within|budget|max|₹|\$)\s*₹?\s*([\d,]+)/i);
    if (budgetMatch) {
      const parsedNum = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(parsedNum) && parsedNum > 100) {
        maxBudget = parsedNum;
      }
    }

    // Dynamic Category & Keyword Extraction
    let category: string | undefined = undefined;

    if (p.includes('mouse')) {
      keywords.push('mouse');
      category = 'Accessories';
    } else if (p.includes('laptop') || p.includes('developerbook') || p.includes('macbook') || p.includes('computer') || p.includes('college')) {
      keywords.push('laptop');
      category = 'Electronics';
    } else if (p.includes('keyboard') || p.includes('keychron') || p.includes('typing') || p.includes('switches')) {
      keywords.push('keyboard');
      category = 'Electronics';
    } else if (p.includes('monitor') || p.includes('screen') || p.includes('display')) {
      keywords.push('monitor');
      category = 'Electronics';
    } else if (p.includes('headphone') || p.includes('audio') || p.includes('anc') || p.includes('listen')) {
      keywords.push('headphones');
      category = 'Electronics';
    } else if (p.includes('stand') || p.includes('desk pad') || p.includes('hub') || p.includes('wrist rest')) {
      keywords.push('accessory');
      category = 'Accessories';
    } else if (p.includes('office') || p.includes('workstation') || p.includes('chair') || p.includes('desk')) {
      keywords.push('office');
      category = 'Office equipment';
    }

    // Intent type determination
    let intentType: ParsedBuyerIntent['intentType'] = 'SEARCH';
    if (p.includes('cheapest') || p.includes('lowest price') || p.includes('budget option')) {
      intentType = 'CHEAPEST';
    } else if (p.includes('ram') || p.includes('specs') || p.includes('most memory') || p.includes('cpu')) {
      intentType = 'SPECS';
    } else if (p.includes('anything else') || p.includes('recommend accessories') || p.includes('need anything') || p.includes('buy a mouse with')) {
      intentType = 'UPSELL_QUERY';
    } else if (p.includes('compare') || p.includes('best two') || p.includes('value')) {
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
    
    // Search catalog with keyword + category + budget parameters
    let catalog = await CatalogTools.searchCatalog({
      maxPrice: intent.maxBudget,
      query: intent.keywords[0],
      category: intent.category,
    });

    // Fallback search if query was broad (e.g. "college", "home office")
    if (catalog.length === 0) {
      catalog = await CatalogTools.searchCatalog({
        maxPrice: intent.maxBudget,
      });
    }

    let recommendedProduct: ProductItem | null = null;
    let replyText = '';

    if (catalog.length > 0) {
      if (intent.intentType === 'CHEAPEST') {
        const sorted = [...catalog].sort((a, b) => a.price - b.price);
        recommendedProduct = sorted[0];
        replyText = `The most budget-friendly option matching your request is the **${recommendedProduct.name}** at ₹${recommendedProduct.price.toLocaleString('en-IN')}.\n\n*Details:* ${recommendedProduct.description}`;
      } else {
        recommendedProduct = catalog[0];
        const budgetNotice = intent.maxBudget
          ? `Within your budget of ₹${intent.maxBudget.toLocaleString('en-IN')}, `
          : '';

        replyText = `${budgetNotice}I recommend the **${recommendedProduct.name}** priced at ₹${recommendedProduct.price.toLocaleString('en-IN')}.\n\n**Why this matches your needs:**\n${recommendedProduct.features.map((f) => `• ${f}`).join('\n')}\n\n*Rationale:* ${recommendedProduct.description}`;
      }
    } else {
      const allProducts = await CatalogTools.searchCatalog({});
      recommendedProduct = allProducts[0];
      replyText = `I couldn't find an exact match under your specified filters, but here is our flagship item: **${recommendedProduct.name}** for ₹${recommendedProduct.price.toLocaleString('en-IN')}.`;
    }

    return {
      replyText,
      recommendedProduct,
      matchedProducts: catalog.slice(0, 4),
      intent,
    };
  }
}
