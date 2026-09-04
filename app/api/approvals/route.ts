import { NextResponse } from 'next/server';
import { ApprovalService } from '@/lib/approval/service';

export async function GET() {
  try {
    const pending = await ApprovalService.getPendingRequests();
    return NextResponse.json({ success: true, requests: pending });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { requestId, decision, decidedBy } = await req.json();

    if (!requestId || !decision) {
      return NextResponse.json({ success: false, error: 'requestId and decision are required' }, { status: 400 });
    }

    const updated = await ApprovalService.decideRequest(requestId, decision, decidedBy || 'Merchant Admin');
    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
