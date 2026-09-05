import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PolicyEngine } from '@/lib/policy/engine';
import { AuditService } from '@/lib/audit/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, requestedBudget, buyerNote } = body;

    if (!productId || typeof requestedBudget !== 'number' || requestedBudget <= 0) {
      return NextResponse.json(
        { error: 'Invalid payload. Required fields: productId (string), requestedBudget (positive number).' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const originalPrice = product.price;

    // Buyer requested a discount if target budget is less than original price
    if (requestedBudget >= originalPrice) {
      return NextResponse.json({
        status: 'NO_DISCOUNT_NEEDED',
        dealApproved: true,
        negotiatedPrice: originalPrice,
        originalPrice,
        discountAmount: 0,
        discountPercent: 0,
        reasoning: 'Requested budget satisfies full retail price. Standard checkout authorized.',
      });
    }

    const requestedDiscount = originalPrice - requestedBudget;
    const policyCheck = await PolicyEngine.validateDiscount(requestedDiscount, originalPrice, 'A2A Negotiation Protocol');
    const transactionCheck = await PolicyEngine.validateTransaction(requestedBudget, 'A2A Negotiation Protocol');

    // Case 1: Autonomous Policy Approval
    if (policyCheck.allowed && transactionCheck.allowed) {
      const discountPercent = ((requestedDiscount / originalPrice) * 100).toFixed(1);

      await AuditService.log({
        actor: 'Merchant Growth Agent',
        agent: 'A2A Bargaining Protocol',
        action: 'A2A_NEGOTIATION_SUCCESS',
        reason: `A2A Negotiation agreed on ₹${requestedBudget.toLocaleString('en-IN')} (${discountPercent}% off retail price ₹${originalPrice.toLocaleString('en-IN')}).`,
        amount: requestedBudget,
        policy: `Max Auto Discount <= 20%`,
        approvalStatus: 'APPROVED',
        result: 'SUCCESS',
      });

      return NextResponse.json({
        status: 'ACCEPTED',
        dealApproved: true,
        negotiatedPrice: requestedBudget,
        originalPrice,
        discountAmount: requestedDiscount,
        discountPercent: parseFloat(discountPercent),
        reasoning: `Merchant Growth Agent autonomously authorized ${discountPercent}% dynamic discount within merchant policy boundaries.`,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          imageUrl: product.imageUrl,
        },
      });
    }

    // Case 2: Requires Human Merchant Approval (Out of Bounds)
    const discountPercent = ((requestedDiscount / originalPrice) * 100).toFixed(1);

    // AI Margin & ROI Reasoning
    const netProfitMargin = Math.round((requestedBudget / originalPrice) * 65);
    const aiRationale = `High-intent buyer requesting ${discountPercent}% discount (₹${requestedDiscount.toLocaleString('en-IN')}). Requested price leaves ${netProfitMargin}% projected gross margin. Inventory level: ${product.inventory} units. Recommended decision: APPROVE to capture customer LTV.`;

    const approvalRequest = await prisma.approvalRequest.create({
      data: {
        agentType: 'BUYER_AGENT',
        actionType: 'A2A_DYNAMIC_DISCOUNT',
        requestedAmount: requestedBudget,
        policyLimit: originalPrice * 0.8,
        reason: policyCheck.blockedReason || transactionCheck.blockedReason || 'Exceeds merchant discount limit',
        payloadJson: JSON.stringify({
          productId: product.id,
          productName: product.name,
          originalPrice,
          requestedPrice: requestedBudget,
          discountPercent,
          buyerNote: buyerNote || 'Dynamic budget negotiation request',
          blockedReason: policyCheck.blockedReason || transactionCheck.blockedReason,
          aiRoiAssessment: {
            recommendedAction: 'APPROVE',
            projectedMargin: `${netProfitMargin}%`,
            stockRemaining: product.inventory,
            customerLtvImpact: 'High Retention Potential',
            aiRationale,
          },
        }),
      },
    });

    await AuditService.log({
      actor: 'AI Buyer Agent',
      agent: 'A2A Bargaining Protocol',
      action: 'A2A_NEGOTIATION_ESCALATED',
      reason: policyCheck.blockedReason || transactionCheck.blockedReason || 'Out of policy threshold',
      amount: requestedBudget,
      policy: 'Merchant Approval Required',
      approvalStatus: 'NOT_REQUIRED',
      result: 'PENDING',
    });

    return NextResponse.json({
      status: 'PENDING_MERCHANT_APPROVAL',
      dealApproved: false,
      approvalId: approvalRequest.id,
      requestedPrice: requestedBudget,
      originalPrice,
      discountAmount: requestedDiscount,
      discountPercent: parseFloat(discountPercent),
      blockedReason: policyCheck.blockedReason || transactionCheck.blockedReason,
      aiRoiAssessment: {
        recommendedAction: 'APPROVE',
        projectedMargin: `${netProfitMargin}%`,
        stockRemaining: product.inventory,
        customerLtvImpact: 'High Retention Potential',
        aiRationale,
      },
    });
  } catch (error: any) {
    console.error('A2A Negotiation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process negotiation' }, { status: 500 });
  }
}
