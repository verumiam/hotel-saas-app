import connect from '@/lib/db-connect';
import Room from '@/models/room';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const PUT = async (request: any, res: any) => {
  if (request.method !== 'PUT') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  const { room, id } = await request.json();

  await connect();

  const _id = new mongoose.Types.ObjectId(id);

  try {
    const updatedRoom = await Room.findByIdAndUpdate(_id, room, { new: true });

    if (!updatedRoom) {
      return new NextResponse('Room not found', { status: 404 });
    }

    return new NextResponse('Room updating successful', { status: 200 });
  } catch (error: any) {
    return res.status(500).json({ message: 'Room updating failed with error: ' + error });
  }
};
