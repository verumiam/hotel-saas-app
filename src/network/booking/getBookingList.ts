'use client';

import { IBooking } from '@/models/booking';

export async function getBookingList(userId: string | string[]): Promise<IBooking[]> {
  const response = await fetch(`/api/booking/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: IBooking[] = await response.json();
  let result: IBooking[] | PromiseLike<IBooking[]>;

  if (Array.isArray(userId)) {
    result = data?.filter((book) => userId.includes(book.userId));
  } else {
    result = data?.filter((book) => book.userId === userId);
  }

  return result;
}
