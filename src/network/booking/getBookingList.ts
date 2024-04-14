import { IBooking } from '@/models/booking';

export async function getBookingList(userId: string | string[]): Promise<IBooking[]> {
  const response = await fetch(`/api/booking/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: IBooking[] = await response.json();
  let result;

  if (Array.isArray(userId)) {
    result = data?.filter((book) => userId.includes(book.userId));
  } else {
    result = data?.filter((book) => book.userId === userId);
  }

  return result;
}
