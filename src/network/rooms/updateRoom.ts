export async function updateRoom(roomData: Record<string, unknown>, id: string) {
  const response = await fetch(`/api/rooms/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ room: roomData, id }),
  });

  if (!response.ok) {
    throw new Error('Failed to update the room');
  }

  return response.json();
}
