import connect from '@/lib/db-connect';
import Room, { IRoom } from '@/models/room';
import { NextResponse } from 'next/server';

export const POST = async (request: any, res: any) => {
  if (request.method !== 'POST') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  const roomData: IRoom = await request.json();

  await connect();

  const newRoom = new Room(roomData);

  try {
    await newRoom.save();
    return new NextResponse('Room created successfully', { status: 200 });
  } catch (error: any) {
    return res.status(500).json({ message: 'Room creating failed with error: ' + error });
  }
};
