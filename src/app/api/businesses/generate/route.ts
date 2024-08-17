import { generate } from '@/data_generation/businesses';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(_: NextRequest) {
  try {
    const businesses = (await generate()).map(business => {
      const newBusiness = { ...business };
      newBusiness.id = newBusiness._id;

      delete newBusiness._id;

      return newBusiness;
    });
    return NextResponse.json({ status: 'success', data: { businesses } });
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
