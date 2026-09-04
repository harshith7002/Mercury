import { NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/razorpay/service';

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, dbOrderId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: 'razorpayOrderId, razorpayPaymentId, and razorpaySignature are required' },
        { status: 400 }
      );
    }

    const verification = await RazorpayService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      dbOrderId,
    });

    return NextResponse.json({
      success: verification.success,
      error: verification.error,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
