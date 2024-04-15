export default async function cancelBookings(selectedBookingIds: string | string[]) {
  const response = await fetch(`/api/booking/cancel`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: selectedBookingIds }),
  });

  return response;
}
