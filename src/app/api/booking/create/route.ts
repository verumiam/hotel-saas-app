import connect from '@/lib/db-connect';
import Booking, { IBooking } from '@/models/booking';
import { NextResponse } from 'next/server';

export const POST = async (request: any, res: any) => {
  if (request.method !== 'POST') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  const bookingData: IBooking = await request.json();

  await connect();

  const newBooking = new Booking(bookingData);

  try {
    await newBooking.save();
    return new NextResponse('Booking created successfully', { status: 200 });
  } catch (error: any) {
    return new NextResponse('Booking creating failed', { status: 500 });
  }
};
