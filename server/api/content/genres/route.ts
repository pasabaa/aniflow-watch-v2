import { NextResponse } from 'next/server';
import { getGenresData } from '@/lib/upstream/loaders';

export const revalidate = 3600;

export async function GET() {
  const data = await getGenresData();
  return NextResponse.json(data);
}
