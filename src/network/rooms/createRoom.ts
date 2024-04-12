export async function createRoom(roomData: Record<string, unknown>) {
  const response = await fetch(`/api/rooms/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roomData),
  });

  if (!response.ok) {
    throw new Error('Failed to create a new room');
  }
}
