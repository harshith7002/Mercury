import { NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/razorpay/service';
import { PolicyEngine } from '@/lib/policy/engine';

export async function POST(req: Request) {
  try {
    const { amount, receipt, notes } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid amount is required' }, { status: 400 });
    }

    // Policy check before initiating order
    const policyCheck = await PolicyEngine.validateTransaction(amount, 'AI Buyer');
    if (!policyCheck.allowed) {
      return NextResponse.json({
        success: false,
        blocked: true,
        error: policyCheck.blockedReason,
        policyCheck,
      }, { status: 403 });
    }

    const razorpayOrder = await RazorpayService.createOrder({
      amount,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
