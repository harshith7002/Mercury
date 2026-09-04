import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PolicyEngine } from '@/lib/policy/engine';

export async function GET() {
  try {
    const policy = await PolicyEngine.getActivePolicy();
    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.customer.count();

    const opportunities = [
      {
        id: 'opp_1',
        title: 'Keychron K2 + Wrist Rest Ergonomic Bundle',
        objective: 'Increase Average Order Value (AOV)',
        analysis: '31% of customers purchasing Keychron K2 mechanical keyboard added a wrist rest within 7 days. Automatic checkout prompt captures high-intent buyers.',
        targetSegment: 'Developers & Mech Keyboard Enthusiasts',
        relevantCustomers: 1240,
        suggestedProduct: 'Ergonomic Memory Foam Wrist Rest',
        suggestedPrice: 799,
        expectedAovImpact: 420,
        risk: 'Low',
        policyStatus: 'Within merchant-approved limits (Policy <= ₹1,000 discount)',
        requiresApproval: false,
      },
      {
        id: 'opp_2',
        title: 'DeveloperBook Workstation Desktop Stand Upsell',
        objective: 'Drive High-Margin Hardware Accessories',
        analysis: '42% co-purchase affinity detected between DeveloperBook Pro 14 and Aluminum Ergonomic Laptop Stand.',
        targetSegment: 'Remote Workers & Software Engineers',
        relevantCustomers: 890,
        suggestedProduct: 'Ergonomic Aluminum Laptop Stand',
        suggestedPrice: 1299,
        expectedAovImpact: 650,
        risk: 'Low',
        policyStatus: 'Within limits',
        requiresApproval: false,
      },
      {
        id: 'opp_3',
        title: 'High-Value VIP Promo Discount Campaign (₹15,000 Override)',
        objective: 'Convert High-Tier Workstation Buyers',
        analysis: 'Agent proposed a special ₹15,000 promotional voucher for high-tier DeveloperBook 16 Studio Workstation purchases.',
        targetSegment: 'Enterprise & Studio Workstation Segment',
        relevantCustomers: 150,
        suggestedProduct: 'DeveloperBook Studio 16 Ultra',
        suggestedPrice: 124999,
        requestedDiscount: 15000,
        expectedAovImpact: 15000,
        risk: 'High',
        policyStatus: `REQUIRES APPROVAL: Requested discount ₹15,000 exceeds merchant auto-limit ₹${policy.maxAutoDiscountAmount.toLocaleString('en-IN')}`,
        requiresApproval: true,
      },
    ];

    return NextResponse.json({
      success: true,
      metrics: {
        totalOrders,
        totalCustomers,
      },
      opportunities,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
