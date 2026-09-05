import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userPrompt = body.prompt || 'I need a mechanical keyboard for programming under ₹6,000.';
    const origin = req.nextUrl.origin || 'http://localhost:3000';

    const httpTrace: Array<{
      step: number;
      name: string;
      method: string;
      url: string;
      status: number;
      latencyMs: number;
      payload: any;
    }> = [];

    // STAGE 1: Agent Discovery over HTTP (GET /api/ai-catalog)
    const t0 = Date.now();
    const catalogRes = await fetch(`${origin}/api/ai-catalog`);
    const catalogData = await catalogRes.json();
    httpTrace.push({
      step: 1,
      name: 'Agent Discovery & Schema Parsing',
      method: 'GET',
      url: `${origin}/api/ai-catalog`,
      status: catalogRes.status,
      latencyMs: Date.now() - t0,
      payload: {
        context: catalogData['@context'],
        itemCount: catalogData.itemCount,
        merchantGovernance: catalogData.merchant?.policyGovernance,
        discoveredProductsSample: catalogData.data?.slice(0, 2).map((p: any) => ({ id: p.id, name: p.name, price: p.price })),
      },
    });

    // STAGE 2: Independent Agent Product Selection
    const selectedItem = catalogData.data?.find((p: any) => p.name.toLowerCase().includes('keychron') || p.name.toLowerCase().includes('keyboard')) || catalogData.data[0];

    // STAGE 3: Agent-to-Merchant (A2M) Commerce Negotiation (POST /api/buyer/negotiate)
    const t1 = Date.now();
    const negotiateRes = await fetch(`${origin}/api/buyer/negotiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: selectedItem.id,
        requestedBudget: 6000,
        buyerNote: 'External HTTP Buyer Agent standard order request',
      }),
    });
    const negotiateData = await negotiateRes.json();
    httpTrace.push({
      step: 2,
      name: 'A2M Commerce Negotiation',
      method: 'POST',
      url: `${origin}/api/buyer/negotiate`,
      status: negotiateRes.status,
      latencyMs: Date.now() - t1,
      payload: negotiateData,
    });

    // STAGE 4: Growth Agent Upsell Acceptance (Ergonomic Wrist Rest ₹799)
    const totalAmount = selectedItem.price + 799;

    // STAGE 5: Policy Engine Validation (POST /api/policy/validate)
    const t2 = Date.now();
    const policyRes = await fetch(`${origin}/api/policy/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'AUTO_TRANSACTION_CHECK',
        amount: totalAmount,
        agentType: 'EXTERNAL_HTTP_BUYER',
        reason: 'Validating cart total against merchant policy ceiling',
      }),
    });
    const policyData = await policyRes.json();
    httpTrace.push({
      step: 3,
      name: 'Policy Engine Authorization Check',
      method: 'POST',
      url: `${origin}/api/policy/validate`,
      status: policyRes.status,
      latencyMs: Date.now() - t2,
      payload: policyData,
    });

    // STAGE 6: Razorpay Order Creation (POST /api/razorpay/order)
    const t3 = Date.now();
    const rzpOrderRes = await fetch(`${origin}/api/razorpay/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount,
        receipt: `rcpt_ext_agent_${Date.now()}`,
      }),
    });
    const rzpOrderData = await rzpOrderRes.json();
    httpTrace.push({
      step: 4,
      name: 'Razorpay Test Gateway Order Creation',
      method: 'POST',
      url: `${origin}/api/razorpay/order`,
      status: rzpOrderRes.status,
      latencyMs: Date.now() - t3,
      payload: rzpOrderData,
    });

    // STAGE 7: Server Signature Verification (POST /api/razorpay/verify)
    const t4 = Date.now();
    const verifyRes = await fetch(`${origin}/api/razorpay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpayOrderId: rzpOrderData.order?.orderId || 'order_test_ext_101',
        razorpayPaymentId: `pay_ext_agent_${Date.now().toString(36)}`,
        razorpaySignature: `sig_ext_hmac_valid_${Date.now()}`,
      }),
    });
    const verifyData = await verifyRes.json();
    httpTrace.push({
      step: 5,
      name: 'Server HMAC-SHA256 Payment Verification',
      method: 'POST',
      url: `${origin}/api/razorpay/verify`,
      status: verifyRes.status,
      latencyMs: Date.now() - t4,
      payload: verifyData,
    });

    return NextResponse.json({
      success: true,
      agentType: 'Standalone External HTTP Buyer Agent',
      userPrompt,
      summary: {
        selectedProduct: selectedItem.name,
        basePrice: selectedItem.price,
        upsellProduct: 'Ergonomic Memory Foam Wrist Rest',
        upsellPrice: 799,
        finalCartTotal: totalAmount,
        orderStatus: verifyData.success ? 'CAPTURED' : 'FAILED',
        policyStatus: policyData.allowed ? 'PASSED' : 'BLOCKED',
      },
      httpTrace,
    });
  } catch (error: any) {
    console.error('External Buyer Runner Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
