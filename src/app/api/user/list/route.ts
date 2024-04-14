import connect from '@/lib/db-connect';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export const GET = async (request: any, res: any) => {
  if (request.method !== 'GET') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  await connect();

  try {
    const users = await User.find({});
    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Users list getting failed with error: ' + error });
  }
};
