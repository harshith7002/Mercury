import { NextResponse } from 'next/server';
import { AIProvider } from '@/lib/ai/provider';
import { CatalogTools } from '@/lib/tools';
import { PolicyEngine } from '@/lib/policy/engine';
import { AuditService } from '@/lib/audit/service';
import { AgentStep } from '@/types';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const steps: AgentStep[] = [];

    const addStep = (title: string, status: AgentStep['status'], detail: string, toolName?: string) => {
      steps.push({
        id: `step_${runId}_${steps.length + 1}`,
        title,
        status,
        detail,
        timestamp: new Date().toLocaleTimeString(),
        toolName,
      });
    };

    // Step 1: Intent Parsed
    addStep('Parsing Intent', 'thinking', `Analyzing buyer intent from prompt: "${prompt}"`);
    const processed = await AIProvider.processBuyerQuery(prompt);

    await AuditService.log({
      actor: 'AI Buyer',
      agent: 'AI Buyer Agent',
      action: 'INTENT_PARSED',
      reason: `[Run ${runId}] Parsed intent: ${processed.intent.intentType}, Budget: ₹${processed.intent.maxBudget || 'Unspecified'}, Category: ${processed.intent.category || 'Any'}`,
      approvalStatus: 'PASSED',
      result: 'SUCCESS',
    });

    addStep('Catalog Searched', 'tool_call', `Queried catalog tools for "${processed.intent.keywords[0] || 'all'}". Found ${processed.matchedProducts.length} matching products.`, 'CatalogTools.searchCatalog');

    let upsellRecommendation = null;
    let policyCheck = null;

    if (processed.recommendedProduct) {
      addStep('Product Recommended', 'completed', `Selected top match: ${processed.recommendedProduct.name} (₹${processed.recommendedProduct.price.toLocaleString('en-IN')})`);

      await AuditService.log({
        actor: 'AI Buyer',
        agent: 'AI Buyer Agent',
        action: 'PRODUCT_RECOMMENDED',
        reason: `[Run ${runId}] Recommended ${processed.recommendedProduct.name} based on user constraints.`,
        amount: processed.recommendedProduct.price,
        approvalStatus: 'PASSED',
        result: 'SUCCESS',
      });

      // Step 2: Merchant Growth Agent triggers upsell search
      addStep('Growth Agent Analysis', 'tool_call', 'Merchant Growth Agent scanning co-purchase affinity graph...', 'CatalogTools.getGrowthAgentUpsell');
      upsellRecommendation = await CatalogTools.getGrowthAgentUpsell(processed.recommendedProduct.id);

      if (upsellRecommendation) {
        addStep(
          'Upsell Opportunity Detected',
          'policy_check',
          `Growth Agent identified high-affinity co-purchase: ${upsellRecommendation.product.name} (₹${upsellRecommendation.discountedPrice}). Reason: ${upsellRecommendation.reason}`,
          'MerchantGrowthAgent'
        );

        // Policy engine validates upsell action
        policyCheck = await PolicyEngine.validateDiscount(
          upsellRecommendation.discountAmount,
          upsellRecommendation.originalPrice,
          'Merchant Growth Agent'
        );

        if (policyCheck.allowed) {
          addStep('Policy Verified', 'completed', 'Upsell offer satisfies merchant margin and discount policy rules.');
          await AuditService.log({
            actor: 'Merchant Growth Agent',
            agent: 'Merchant Growth Agent',
            action: 'UPSELL_RECOMMENDED',
            reason: `[Run ${runId}] Recommended ${upsellRecommendation.product.name} for ${processed.recommendedProduct.name}. Co-purchase rate: ${Math.round(upsellRecommendation.confidenceScore * 100)}%`,
            amount: upsellRecommendation.discountedPrice,
            policy: 'Within merchant-approved limits',
            approvalStatus: 'PASSED',
            result: 'SUCCESS',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      runId,
      replyText: processed.replyText,
      recommendedProduct: processed.recommendedProduct,
      matchedProducts: processed.matchedProducts,
      upsellRecommendation,
      policyCheck,
      steps,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
