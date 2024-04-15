export default async function updateRoom(roomData: Record<string, unknown>, id: string) {
  const response = await fetch(`/api/rooms/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ room: roomData, id }),
  });

  return response.json();
}
