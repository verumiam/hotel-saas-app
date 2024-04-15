export async function createBooking(bookingData: Record<string, unknown>) {
  const response = await fetch(`/api/booking/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  return response;
}
