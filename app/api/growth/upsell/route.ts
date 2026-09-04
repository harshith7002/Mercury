import { NextResponse } from 'next/server';
import { CatalogTools } from '@/lib/tools';
import { PolicyEngine } from '@/lib/policy/engine';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ success: false, error: 'productId parameter is required' }, { status: 400 });
  }

  try {
    const upsell = await CatalogTools.getGrowthAgentUpsell(productId);
    if (!upsell) {
      return NextResponse.json({ success: true, upsell: null });
    }

    const policyCheck = await PolicyEngine.validateDiscount(
      upsell.discountAmount,
      upsell.originalPrice,
      'Merchant Growth Agent'
    );

    return NextResponse.json({
      success: true,
      upsell,
      policyCheck,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
