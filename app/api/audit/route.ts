import { NextResponse } from 'next/server';
import { AuditService } from '@/lib/audit/service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const actor = searchParams.get('actor') || undefined;
  const action = searchParams.get('action') || undefined;
  const result = searchParams.get('result') || undefined;
  const search = searchParams.get('search') || undefined;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100;

  try {
    const events = await AuditService.getEvents({
      actor,
      action,
      result,
      search,
      limit,
    });
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
