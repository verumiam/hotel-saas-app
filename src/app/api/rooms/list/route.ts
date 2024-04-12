import connect from '@/lib/db-connect';
import Room from '@/models/room';
import { NextResponse } from 'next/server';

export const GET = async (request: any, res: any) => {
  if (request.method !== 'GET') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  await connect();

  try {
    const rooms = await Room.find({});
    return new NextResponse(JSON.stringify(rooms), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Rooms list getting failed with error: ' + error });
  }
};
