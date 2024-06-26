import connect from '@/lib/db-connect';
import Booking from '@/models/booking';
import { NextResponse } from 'next/server';

export const GET = async (request: any, res: any) => {
  if (request.method !== 'GET') {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  await connect();

  try {
    const bookings = await Booking.find().limit(100);

    return new NextResponse(JSON.stringify(bookings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new NextResponse('Booking list getting failed', {
      status: 500,
    });
  }
};
