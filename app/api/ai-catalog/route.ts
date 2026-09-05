import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PolicyEngine } from '@/lib/policy/engine';
import { LiveMarketService } from '@/lib/catalog/live-market';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.nextUrl.searchParams.get('apiKey') || undefined;
    const liveItems = await LiveMarketService.fetchLiveCatalog(apiKey);

    const dbProducts = await prisma.product.findMany({
      take: 50,
      orderBy: { price: 'desc' },
    });

    // Merge live market API items if API key provided, otherwise use local merchant DB
    const products = liveItems.length > 0
      ? liveItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          inventory: item.inventory,
          imageUrl: item.imageUrl,
        }))
      : dbProducts;

    const activePolicy = await PolicyEngine.getActivePolicy();

    const origin = req.nextUrl.origin || 'https://mercury-agentic.vercel.app';

    // JSON-LD Agentic Commerce Catalog Specification
    const agenticCatalog = {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      name: 'Mercury Agentic Commerce Catalog Feed',
      description: 'Machine-readable product catalog and policy-governed transaction API for autonomous AI buyers.',
      merchant: {
        '@type': 'Organization',
        name: activePolicy.merchantName,
        policyGovernance: {
          maxAutoDiscountPercent: activePolicy.maxAutoDiscountPercent,
          maxAutoTransactionAmount: activePolicy.maxAutoTransactionAmount,
          approvalRequiredThreshold: activePolicy.approvalThresholdAmount,
          active: activePolicy.active,
        },
      },
      agentEndpoints: {
        negotiate: `${origin}/api/buyer/negotiate`,
        policyValidate: `${origin}/api/policy/validate`,
        createOrder: `${origin}/api/razorpay/order`,
        verifyPayment: `${origin}/api/razorpay/verify`,
        paymentLink: `${origin}/api/razorpay/payment-link`,
        openApiSpec: `${origin}/api/ai-catalog/openapi.json`,
      },
      itemCount: products.length,
      data: products.map((p) => ({
        '@type': 'Product',
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        currency: 'INR',
        stock: p.inventory,
        imageUrl: p.imageUrl,
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'INR',
          availability: p.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          negotiable: true,
          maxAutoDiscountAvailable: Math.min(
            (p.price * activePolicy.maxAutoDiscountPercent) / 100,
            activePolicy.maxAutoDiscountAmount
          ),
        },
      })),
    };

    return NextResponse.json(agenticCatalog, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/ld+json',
      },
    });
  } catch (error: any) {
    console.error('AI Catalog Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI catalog feed' }, { status: 500 });
  }
}
