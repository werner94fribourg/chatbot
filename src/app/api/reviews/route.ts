import { generate } from '@/data_generation/reviews';
import { REVIEWS_DATA_FILE } from '@/utils/backend/globals';
import { Review } from '@/utils/backend/utils';
import { readFile } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'util';

export async function GET(_: NextRequest) {
  const reviews = JSON.parse(
    (await promisify(readFile)(REVIEWS_DATA_FILE, 'utf-8')).toString()
  ) as Review[];

  return NextResponse.json({ status: 'success', data: { reviews } });
}

export function PATCH(_: NextRequest) {
  try {
    generate();
  } finally {
    return NextResponse.json({
      status: 'success',
      message: 'Reviews generation successfully started.',
    });
  }
}
