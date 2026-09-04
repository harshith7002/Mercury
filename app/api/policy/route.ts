import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PolicyEngine } from '@/lib/policy/engine';
import { AuditService } from '@/lib/audit/service';

export async function GET() {
  try {
    const policy = await PolicyEngine.getActivePolicy();
    return NextResponse.json({ success: true, policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.policy.update({
      where: { id: 'merchant_default' },
      data: {
        maxAutoDiscountAmount: Number(body.maxAutoDiscountAmount),
        maxAutoDiscountPercent: Number(body.maxAutoDiscountPercent),
        maxCampaignBudget: Number(body.maxCampaignBudget),
        maxAutoTransactionAmount: Number(body.maxAutoTransactionAmount),
        approvalThresholdAmount: Number(body.approvalThresholdAmount),
        maxUpsellAttempts: Number(body.maxUpsellAttempts),
      },
    });

    await AuditService.log({
      actor: 'Merchant Admin',
      agent: 'PolicyEngine',
      action: 'UPDATE_MERCHANT_POLICY',
      reason: `Updated merchant policy rules (Max Auto Discount: ₹${updated.maxAutoDiscountAmount}, Max Auto Tx: ₹${updated.maxAutoTransactionAmount}).`,
      approvalStatus: 'PASSED',
      result: 'SUCCESS',
    });

    return NextResponse.json({ success: true, policy: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
