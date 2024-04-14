import connect from '@/lib/db-connect';
import Booking from '@/models/booking';
import { NextResponse } from 'next/server';

export const DELETE = async (request: any, res: any) => {
  if (request.method !== 'DELETE') {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  await connect();

  const { ids } = await request.json();

  try {
    if (Array.isArray(ids)) {
      await Booking.deleteMany({ _id: { $in: ids } });
    } else {
      await Booking.deleteOne({ _id: ids });
    }

    return new NextResponse('Бронирование отменено', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new NextResponse('Error cancel booking', {
      status: 500,
    });
  }
};
