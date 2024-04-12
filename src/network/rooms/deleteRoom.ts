export default async function deleteRoom(selectedRoomIds: string | string[]) {
  const response = await fetch(`/api/rooms/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: selectedRoomIds }),
  });

  if (!response.ok) {
    throw new Error('Произошла ошибка при удалении номера.');
  }

  return await response.json();
}
