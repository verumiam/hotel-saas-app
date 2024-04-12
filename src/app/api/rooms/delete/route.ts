import connect from '@/lib/db-connect';
import Room from '@/models/room';
import { NextResponse } from 'next/server';

export const DELETE = async (request: any, res: any) => {
  if (request.method !== 'DELETE') {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  await connect();

  const { ids } = await request.json();

  try {
    if (Array.isArray(ids)) {
      await Room.deleteMany({ _id: { $in: ids } });
    } else {
      await Room.deleteOne({ _id: ids });
    }

    return new NextResponse('Комнаты удалены', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting rooms: ' + error.message });
  }
};
