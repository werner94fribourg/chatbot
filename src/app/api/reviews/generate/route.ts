import { generate } from '@/data_generation/reviews';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(_: NextRequest) {
  try {
    const reviews = (await generate()).map(review => {
      const newReview = { ...review };
      newReview.id = newReview._id;

      delete newReview._id;
      return newReview;
    });
    return NextResponse.json({ status: 'success', data: { reviews } });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'The server encountered a problem. Try again later.',
        error,
      },
      { status: 500 }
    );
  }
}
