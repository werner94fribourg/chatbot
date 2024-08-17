import { BUSINESSES_DATA_FILE } from '@/utils/backend/globals';
import { Business } from '@/utils/backend/utils';
import { readFile } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'util';

export async function GET(_: NextRequest) {
  let businesses = JSON.parse(
    (await promisify(readFile)(BUSINESSES_DATA_FILE, 'utf-8')).toString()
  ) as Business[];

  businesses = businesses.map(business => {
    const newBusiness = { ...business };
    newBusiness.id = newBusiness._id;

    delete business._id;

    return newBusiness;
  });

  return NextResponse.json({ status: 'success', data: { businesses } });
}
