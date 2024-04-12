export async function getBookingList(userID: string) {
  const response = await fetch(`/api/booking/list?userID=${userID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}
