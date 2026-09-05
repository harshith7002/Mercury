import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/razorpay/service';
import { AuditService } from '@/lib/audit/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, customerName, customerEmail } = body;

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Valid positive amount (number) is required.' }, { status: 400 });
    }

    const orderResult = await RazorpayService.createOrder({
      amount,
      notes: {
        description: description || 'Mercury Agentic Payment Link',
        customerName: customerName || 'Valued Buyer',
      },
    });

    const paymentLinkId = `plink_test_${Date.now().toString(36)}`;
    const shortUrl = `https://rzp.io/i/test_${orderResult.orderId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)}`;

    // Generate UPI Intent String for mobile scanning
    const upiString = `upi://pay?pa=mercury.razorpay@icici&pn=Mercury+Agentic+Commerce&tr=${orderResult.orderId}&am=${amount}&cu=INR&tn=${encodeURIComponent(description || 'Agentic Commerce Order')}`;

    await AuditService.log({
      actor: 'Razorpay Agent',
      agent: 'PaymentLinkGenerator',
      action: 'PAYMENT_LINK_CREATED',
      reason: `Generated Razorpay Test Mode Payment Link & UPI QR Code for ₹${amount.toLocaleString('en-IN')}`,
      amount,
      approvalStatus: 'PASSED',
      result: 'SUCCESS',
      metadataJson: JSON.stringify({ paymentLinkId, shortUrl, upiString }),
    });

    return NextResponse.json({
      success: true,
      paymentLinkId,
      orderId: orderResult.orderId,
      amount,
      currency: 'INR',
      shortUrl,
      upiString,
      qrDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`,
      isMock: orderResult.isMock,
      keyId: orderResult.keyId,
    });
  } catch (error: any) {
    console.error('Payment Link Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate payment link' }, { status: 500 });
  }
}
