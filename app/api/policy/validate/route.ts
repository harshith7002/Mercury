import { NextResponse } from 'next/server';
import { PolicyEngine } from '@/lib/policy/engine';
import { ApprovalService } from '@/lib/approval/service';

export async function POST(req: Request) {
  try {
    const { actionType, amount, itemPrice, agentType, reason } = await req.json();

    let checkResult;
    if (actionType === 'DISCOUNT') {
      checkResult = await PolicyEngine.validateDiscount(amount, itemPrice || 1000, agentType || 'AI Agent');
    } else {
      checkResult = await PolicyEngine.validateTransaction(amount, agentType || 'AI Agent');
    }

    let approvalRequest = null;
    if (!checkResult.allowed && checkResult.requiresApproval) {
      approvalRequest = await ApprovalService.createRequest({
        agentType: agentType || 'GROWTH_AGENT',
        actionType: actionType || 'EXCESSIVE_DISCOUNT',
        requestedAmount: amount,
        policyLimit: checkResult.policyLimit || 1000,
        reason: reason || checkResult.blockedReason || 'Action exceeds financial authority limits.',
        payloadJson: JSON.stringify({ actionType, amount, itemPrice, agentType }),
      });
    }

    return NextResponse.json({
      success: true,
      checkResult,
      approvalRequest,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
