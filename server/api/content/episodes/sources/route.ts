import { NextRequest, NextResponse } from 'next/server';
import { getSourcesData } from '@/lib/upstream/loaders';

export const revalidate = 180;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const number = searchParams.get('number');
  const audio = (searchParams.get('audio')?.toUpperCase() === 'DUB' ? 'DUB' : 'SUB') as 'SUB' | 'DUB';

  if (!slug || !number) {
    return NextResponse.json({ error: 'MISSING_SLUG_OR_NUMBER' }, { status: 400 });
  }

  const data = await getSourcesData(slug, number, audio);
  return NextResponse.json(data);
}
