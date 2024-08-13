import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { name: string } }
) {
  return NextResponse.json({ message: `Hello, ${params.name}!` });
}
