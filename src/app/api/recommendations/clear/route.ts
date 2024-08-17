import { clearContext } from '@/recommendations/recommendations';
import { NextRequest, NextResponse } from 'next/server';

export function PATCH(_: NextRequest) {
  try {
    clearContext();
    return NextResponse.json({
      status: 'success',
      message: 'The context was successfully cleared.',
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'fail',
        message: 'The server crashed. Try again!',
      },
      { status: 500 }
    );
  }
}
