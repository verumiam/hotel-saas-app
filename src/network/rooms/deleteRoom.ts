export default async function deleteRoom(selectedRoomIds: string | string[]) {
  const response = await fetch(`/api/rooms/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: selectedRoomIds }),
  });

  return response;
}
