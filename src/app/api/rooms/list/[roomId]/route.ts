import connect from '@/lib/db-connect';
import Room from '@/models/room';
import { NextResponse } from 'next/server';

export const GET = async (request: any, res: any) => {
  if (request.method !== 'GET') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  const id = request.query.roomID;

  await connect();

  try {
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    return new NextResponse(JSON.stringify(room), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Rooms list getting failed with error: ' + error });
  }
};
