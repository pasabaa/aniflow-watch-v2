import { NextResponse } from 'next/server';
import { getHomeData } from '@/lib/upstream/loaders';

export const revalidate = 600;

export async function GET() {
  const data = await getHomeData();
  return NextResponse.json(data);
}
