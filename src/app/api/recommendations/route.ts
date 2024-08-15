import { getRecommendations } from '@/recommendations/recommendations';
import { NextRequest, NextResponse } from 'next/server';

const getErrorResponse = () =>
  NextResponse.json(
    { status: 'fail', message: 'Invalid request object.' },
    { status: 400 }
  );

export async function POST(req: NextRequest) {
  if (req.headers.get('content-type') !== 'application/json') {
    return getErrorResponse();
  }

  const body = await req.json();

  if (typeof body !== 'object' && body?.prompt === undefined)
    return getErrorResponse();

  const { prompt } = body;

  if (typeof prompt !== 'string') return getErrorResponse();

  try {
    const answer = await getRecommendations(prompt);

    return NextResponse.json({ status: 'success', data: { answer } });
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
