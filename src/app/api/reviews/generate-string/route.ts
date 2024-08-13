import { generateTextFile } from '@/data_generation/reviews';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(_: NextRequest) {
  try {
    const string = await generateTextFile();
    return NextResponse.json({
      status: 'success',
      message: 'Textfile generation successfully generated.',
      string,
    });
  } catch (err) {
    return NextResponse.json({
      status: 'fail',
      message: 'Error while trying to generate the string file.',
    });
  }
}
