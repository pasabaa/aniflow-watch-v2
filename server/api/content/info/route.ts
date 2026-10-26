import { NextRequest, NextResponse } from 'next/server';
import { getInfoData } from '@/lib/upstream/loaders';

export const revalidate = 600;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'MISSING_SLUG_PARAM' }, { status: 400 });
  }

  const data = await getInfoData(slug);
  return NextResponse.json(data);
}
