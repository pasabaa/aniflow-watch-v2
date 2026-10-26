import { NextResponse } from 'next/server';
import { getCategoriesData } from '@/lib/upstream/loaders';

export const revalidate = 3600;

export async function GET() {
  const data = await getCategoriesData();
  return NextResponse.json(data);
}
