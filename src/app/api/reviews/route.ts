import { REVIEWS_DATA_FILE } from '@/utils/backend/globals';
import { Review } from '@/utils/backend/utils';
import { readFile } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'util';

export async function GET(_: NextRequest) {
  let reviews = JSON.parse(
    (await promisify(readFile)(REVIEWS_DATA_FILE, 'utf-8')).toString()
  ) as Review[];

  reviews = reviews.map(review => {
    const newReview = { ...review };
    newReview.id = newReview._id;

    delete review._id;

    return newReview;
  });

  return NextResponse.json({ status: 'success', data: { reviews } });
}
