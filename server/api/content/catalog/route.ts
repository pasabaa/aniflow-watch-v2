import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCatalogData } from '@/lib/upstream/loaders';

const catalogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().optional().default(''),
  genre: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional().default('all'),
  sort: z.string().optional().default('popular'),
  year: z.coerce.number().optional(),
});

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = catalogQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_QUERY_PARAMS', details: parsed.error.format() }, { status: 400 });
  }

  const data = await getCatalogData(parsed.data);
  return NextResponse.json(data);
}
