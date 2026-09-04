import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit/service';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      items,
      totalAmount,
      baseAmount,
      upsellAmount,
      discountAmount,
      isAiAssisted,
      razorpayOrderId,
      paymentMethod,
    } = body;

    const order = await prisma.order.create({
      data: {
        customerName: customerName || 'Alex Chen',
        customerEmail: customerEmail || 'alex.chen@devmail.com',
        totalAmount,
        baseAmount,
        upsellAmount: upsellAmount || 0,
        discountAmount: discountAmount || 0,
        isAiAssisted: isAiAssisted !== undefined ? isAiAssisted : true,
        status: 'PENDING',
        razorpayOrderId,
        paymentMethod: paymentMethod || 'RAZORPAY_TEST_MODE',
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            productName: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity || 1,
            isUpsell: Boolean(item.isUpsell),
          })),
        },
      },
      include: { items: true },
    });

    await AuditService.log({
      actor: 'AI Buyer',
      agent: 'AI Buyer Agent',
      action: 'ORDER_INITIATED',
      reason: `Initiated checkout for Order ${order.id} with total ₹${totalAmount.toLocaleString('en-IN')}${upsellAmount > 0 ? ` (Includes ₹${upsellAmount} Growth Agent upsell)` : ''}`,
      amount: totalAmount,
      approvalStatus: 'PASSED',
      result: 'PENDING',
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
