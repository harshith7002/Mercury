import { NextResponse } from 'next/server';
import { CatalogTools } from '@/lib/tools';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || undefined;
  const category = searchParams.get('category') || undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  try {
    const products = await CatalogTools.searchCatalog({ query, category, maxPrice });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
